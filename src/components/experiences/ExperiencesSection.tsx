import React, { useState, useEffect, useCallback } from 'react';
import { ExperienceStats } from './ExperienceStats';
import { CreateExperienceModal } from './CreateExperienceModal';
import { ExperienceTable } from './ExperienceTable';
import { ExperienceCharts } from './ExperienceCharts';
import { ExperienciaCompleta } from '../../types/experience';
import { experienceService } from '../../services/experienceService';
import { AlertCircle, CheckCircle, Plus, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export const ExperiencesSection: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienciaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalExperiences, setTotalExperiences] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // modal creación
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    total: 0,
    verificadas: 0,
    espanol: 0,
    ingles: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados para gráficos
  const [difficultyDistribution, setDifficultyDistribution] = useState<{ difficulty: string; count: number }[]>([]);
  const [languageDistribution, setLanguageDistribution] = useState<{ language: string; count: number }[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  // --- Helpers ---
  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const experiencesData = await experienceService.getExperiences(currentPage, pageSize);
      if (experiencesData && typeof experiencesData === 'object' && 'experiencias' in experiencesData) {
        setExperiences(experiencesData.experiencias || []);
        setTotalExperiences(experiencesData.total || 0);
        setTotalPages(Math.ceil((experiencesData.total || 0) / pageSize));
      } else if (Array.isArray(experiencesData)) {
        setExperiences(experiencesData);
        setTotalExperiences(experiencesData.length);
        setTotalPages(1);
      } else {
        setExperiences([]);
        setTotalExperiences(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error cargando experiencias:', error);
      setExperiences([]);
      setTotalExperiences(0);
      setTotalPages(0);
      showNotification('error', 'Error al cargar las experiencias');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // --- Efecto: paginación o cambio de tamaño (solo cuando NO estamos buscando) ---
  useEffect(() => {
    if (!isSearching) {
      loadExperiences();
    }
  }, [currentPage, pageSize, isSearching, loadExperiences]);

  // --- Efecto: búsqueda global ---
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  // --- Efecto: estadísticas y gráficas (una sola vez al montar) ---
  useEffect(() => {
    loadStats();
    loadChartsData();
  
  }, []);

  // --- helpers notificación ---
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };



  const loadStats = async () => {
    try {
      setStatsLoading(true);
      console.log('📊 Cargando estadísticas de experiencias...');
      const statsData = await experienceService.getExperienceStats();
      console.log('📊 Estadísticas recibidas:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setStats({
        total: 0,
        verificadas: 0,
        espanol: 0,
        ingles: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const loadChartsData = async () => {
    try {
      setChartsLoading(true);
      console.log('📊 Cargando datos para gráficas de experiencias...');
      
      const allExperiencesData = await experienceService.getExperiences(1, 300);
      const allExperiences = allExperiencesData.experiencias || [];
      
      console.log('📊 Total de experiencias para gráficas:', allExperiences.length);
      
      // Procesar distribución por dificultad
      const difficultyData = processDifficultyDistribution(allExperiences);
      setDifficultyDistribution(difficultyData);
      
      // Procesar distribución por idioma
      const languageData = processLanguageDistribution(allExperiences);
      setLanguageDistribution(languageData);
      
      console.log('📊 Datos de dificultad procesados:', difficultyData);
      console.log('📊 Datos de idioma procesados:', languageData);
    } catch (error) {
      console.error('Error cargando datos para gráficas:', error);
      setDifficultyDistribution([]);
      setLanguageDistribution([]);
    } finally {
      setChartsLoading(false);
    }
  };

  const processDifficultyDistribution = (experiences: ExperienciaCompleta[]): { difficulty: string; count: number }[] => {
    const difficultyCount: { [key: string]: number } = {};
    
    experiences.forEach(exp => {
      const difficulty = exp.dificultad.toLowerCase();
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
    });
    
    return Object.entries(difficultyCount).map(([difficulty, count]) => ({
      difficulty,
      count
    })).sort((a, b) => b.count - a.count);
  };

  const processLanguageDistribution = (experiences: ExperienciaCompleta[]): { language: string; count: number }[] => {
    const languageCount: { [key: string]: number } = {};
    
    experiences.forEach(exp => {
      const language = exp.idioma.toLowerCase();
      languageCount[language] = (languageCount[language] || 0) + 1;
    });
    
    return Object.entries(languageCount).map(([language, count]) => ({
      language,
      count
    })).sort((a, b) => b.count - a.count);
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      // Si no hay término de búsqueda, cargar experiencias normalmente
      setIsSearching(false);
      setSearchTerm('');
      loadExperiences();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      
      console.log('🔍 Iniciando búsqueda global de experiencias:', term);
      
      // Obtener todas las experiencias para búsqueda local (siguiendo patrón de usuarios)
      const allExperiencesData = await experienceService.getExperiences(1, 300);
      const allExperiences = Array.isArray(allExperiencesData) ? allExperiencesData : allExperiencesData.experiencias || [];
      
      // Filtrar localmente
      const filteredExperiences = allExperiences.filter(exp =>
        exp.proveedor_nombre.toLowerCase().includes(term.toLowerCase()) ||
        exp.proveedor_ciudad.toLowerCase().includes(term.toLowerCase()) ||
        exp.proveedor_pais.toLowerCase().includes(term.toLowerCase()) ||
        exp.idioma.toLowerCase().includes(term.toLowerCase()) ||
        exp.dificultad.toLowerCase().includes(term.toLowerCase()) ||
        exp.punto_de_encuentro.toLowerCase().includes(term.toLowerCase())
      );
      
      // Aplicar paginación manual
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = filteredExperiences.slice(startIndex, endIndex);
      
      setExperiences(paginatedResults);
      setTotalExperiences(filteredExperiences.length);
      setTotalPages(Math.ceil(filteredExperiences.length / pageSize));
      
      console.log(`✅ Búsqueda local completada: ${filteredExperiences.length} resultados encontrados`);
      
      if (filteredExperiences.length === 0) {
        showNotification('error', `No se encontraron experiencias que coincidan con "${term}"`);
      }
    } catch (error) {
      console.error('Error en búsqueda local:', error);
      setExperiences([]);
      setTotalExperiences(0);
      setTotalPages(0);
      showNotification('error', 'Error al buscar experiencias');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    
    if (!term.trim()) {
      setIsSearching(false);
      loadExperiences();
    } else {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    loadExperiences();
  };

  const handlePageChange = (page: number) => {
    console.log('📄 Cambiando a página:', page);
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    console.log('📏 Cambiando tamaño de página:', size);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleDataChange = () => {
    console.log('📊 Datos actualizados, recargando tabla...');
    // Recargar solo los datos necesarios
    loadExperiences();
    loadStats();
  };



  // Exportar experiencias a Excel
  const handleExportExperiences = async () => {
    try {
      showNotification('success', 'Generando archivo, por favor espera...');
      const data = await experienceService.getExperiences(1, 1000);
      const experiencias: ExperienciaCompleta[] = Array.isArray(data)
        ? data
        : data.experiencias || [];

      if (!experiencias.length) {
        showNotification('error', 'No hay datos para exportar');
        return;
      }

      // Convertir a formato plano para la hoja
      const rows = (experiencias as any[]).map(exp => ({
        Proveedor: exp.proveedor_nombre,
        Ciudad: exp.proveedor?.ciudad || '',
        Pais: exp.proveedor?.pais || '',
        Descripcion: exp.proveedor?.descripcion || '',
        Idioma: exp.idioma,
        Dificultad: exp.dificultad,
        Duracion_horas: exp.duracion,
        'Incluye Transporte': exp.incluye_transporte ? 'Sí' : 'No',
        'Guía Incluido': exp.guia_incluido ? 'Sí' : 'No',
        'Grupo Máximo': exp.grupo_maximo,
        Verificado: exp.proveedor_verificado ? 'Sí' : 'No',
        Registro: exp.fecha_registro,
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Experiencias');

      const fecha = new Date().toISOString().split('T')[0];
      // Generar ArrayBuffer y descargar manualmente para asegurar extensión
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `experiencias_${fecha}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('success', 'Archivo exportado');
    } catch (error) {
      console.error('Error exportando experiencias:', error);
      showNotification('error', 'Error al exportar');
    }
  };



  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Experiencias</h1>
          <p className="text-gray-600 mt-2">
            Administra todas las experiencias y tours del sistema
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportExperiences}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download className="h-5 w-5" />
            <span>Exportar Experiencias</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Experiencia</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <ExperienceStats
        totalExperiences={stats.total}
        verificadas={stats.verificadas}
        espanol={stats.espanol}
        ingles={stats.ingles}
        loading={statsLoading}
      />

      {/* Experiences Table */}
      <ExperienceTable
        experiences={experiences}
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalExperiences={totalExperiences}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDataChange={handleDataChange}
      />

      {/* Modal Crear Experiencia */}
      <CreateExperienceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        loading={creating}
        onSave={async (payload) => {
          try {
            setCreating(true);
            await experienceService.createExperience(payload);
            showNotification('success', 'Experiencia creada correctamente');
            setShowCreateModal(false);
            // Recargar lista desde el servidor y mostrar página 1
            setCurrentPage(1);
            await loadExperiences();
            loadStats();
            loadChartsData();
          } catch (e: any) {
            showNotification('error', e.message || 'Error creando experiencia');
          } finally {
            setCreating(false);
          }
        }}
      />

      {/* Charts */}
      <ExperienceCharts
        difficultyDistribution={difficultyDistribution}
        languageDistribution={languageDistribution}
        chartsLoading={chartsLoading}
      />
    </div>
  );
};