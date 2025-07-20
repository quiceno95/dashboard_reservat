import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { RutaData, RutaStats as RutaStatsType, RutaChartData } from '../../types/ruta';
import { rutaService } from '../../services/rutaService';
import RutaTable from './RutaTable';
import RutaStats from './RutaStats';
import RutaCharts from './RutaCharts';
import RutaDetailModal from './RutaDetailModal';
import EditRutaModal from './EditRutaModal';
import CreateRutaModal from './CreateRutaModal';
import Swal from 'sweetalert2';

const RutasSection: React.FC = () => {
  // Estados principales
  const [rutas, setRutas] = useState<RutaData[]>([]);
  const [filteredRutas, setFilteredRutas] = useState<RutaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Estados para estadísticas y gráficos
  const [stats, setStats] = useState<RutaStatsType>({
    totalRutas: 0,
    rutasActivas: 0,
    rutasRecomendadas: 0,
    duracionPromedio: 0
  });
  const [chartData, setChartData] = useState<RutaChartData>({
    estados: [],
    recomendadas: []
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Estados para modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRutaId, setSelectedRutaId] = useState<string | null>(null);

  // Cargar rutas
  const loadRutas = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await rutaService.getRutas(page - 1, size); // API usa paginación 0-based
      
      setRutas(response.rutas);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / size));
      
      // Si no hay búsqueda activa, usar los datos paginados de la API
      if (!searchTerm) {
        setFilteredRutas(response.rutas);
      }
      
    } catch (error) {
      console.error('Error loading rutas:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar las rutas',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      // Obtener todas las rutas para calcular estadísticas
      const response = await rutaService.getRutas(0, 1000);
      const todasLasRutas = response.rutas;

      const totalRutas = todasLasRutas.length;
      const rutasActivas = todasLasRutas.filter(r => r.activo).length;
      const rutasRecomendadas = todasLasRutas.filter(r => r.recomendada).length;
      const duracionPromedio = totalRutas > 0 
        ? Math.round(todasLasRutas.reduce((sum, r) => sum + r.duracion_estimada, 0) / totalRutas)
        : 0;

      setStats({
        totalRutas,
        rutasActivas,
        rutasRecomendadas,
        duracionPromedio
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Cargar datos para gráficos
  const loadChartData = async () => {
    try {
      setChartsLoading(true);
      const response = await rutaService.getRutas(0, 1000);
      const todasLasRutas = response.rutas;

      const rutasActivas = todasLasRutas.filter(r => r.activo).length;
      const rutasInactivas = todasLasRutas.length - rutasActivas;
      const rutasRecomendadas = todasLasRutas.filter(r => r.recomendada).length;
      const rutasNoRecomendadas = todasLasRutas.length - rutasRecomendadas;

      setChartData({
        estados: [
          { name: 'Activas', value: rutasActivas, color: 'from-green-500 to-green-600' },
          { name: 'Inactivas', value: rutasInactivas, color: 'from-red-500 to-red-600' }
        ],
        recomendadas: [
          { name: 'Recomendadas', value: rutasRecomendadas, color: 'from-blue-500 to-blue-600' },
          { name: 'No Recomendadas', value: rutasNoRecomendadas, color: 'from-gray-500 to-gray-600' }
        ]
      });

    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setChartsLoading(false);
    }
  };

  // Filtrado local para búsqueda
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const filtered = rutas.filter(ruta =>
        ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.puntos_interes.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRutas(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize));
    } else {
      setIsSearching(false);
      setFilteredRutas(rutas);
      // Restaurar valores de paginación de la API
      loadRutas(currentPage, pageSize);
    }
  }, [searchTerm, rutas, pageSize]);

  // Cargar datos iniciales
  useEffect(() => {
    loadRutas();
    loadStats();
    loadChartData();
  }, []);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (!searchTerm) {
      loadRutas(page, pageSize);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (!searchTerm) {
      loadRutas(1, size);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleViewDetails = (id: string) => {
    setSelectedRutaId(id);
    setDetailModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRutaId(id);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ruta = rutas.find(r => r.id === id);
    const rutaName = ruta ? ruta.nombre : 'esta ruta';

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <div class="text-center">
          <p class="text-gray-600 mb-2">Vas a eliminar la ruta:</p>
          <p class="font-semibold text-gray-900 text-lg">${rutaName}</p>
          <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await rutaService.deleteRuta(id);
        
        await Swal.fire({
          title: '¡Eliminada!',
          text: 'Ruta eliminada correctamente',
          icon: 'success',
          confirmButtonColor: '#059669',
          timer: 3000,
          timerProgressBar: true
        });

        // Recargar datos
        loadRutas();
        loadStats();
        loadChartData();
        
      } catch (error) {
        console.error('Error deleting ruta:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al eliminar la ruta',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const handleExport = async () => {
    try {
      await rutaService.exportRutasToExcel();
      
      await Swal.fire({
        title: '¡Exportado!',
        text: 'Las rutas se han exportado correctamente',
        icon: 'success',
        confirmButtonColor: '#059669',
        timer: 3000,
        timerProgressBar: true
      });
      
    } catch (error) {
      console.error('Error exporting rutas:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al exportar las rutas',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const handleDataChange = () => {
    loadRutas();
    loadStats();
    loadChartData();
  };

  // Obtener rutas para la página actual
  const getCurrentPageRutas = () => {
    if (!searchTerm) {
      return filteredRutas; // Datos ya paginados por la API
    }
    
    // Paginación local para búsqueda
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRutas.slice(startIndex, endIndex);
  };

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Rutas</h1>
          <p className="text-gray-600">Administra las rutas de transporte y turismo</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Rutas
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Ruta
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <RutaStats stats={stats} loading={statsLoading} />

      {/* Tabla */}
      <RutaTable
        rutas={getCurrentPageRutas()}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        searchTerm={searchTerm}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Gráficos */}
      <RutaCharts chartData={chartData} loading={chartsLoading} />

      {/* Modales */}
      <RutaDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedRutaId(null);
        }}
        ruta={selectedRutaId ? rutas.find(r => r.id === selectedRutaId) || null : null}
      />

      <EditRutaModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRutaId(null);
        }}
        ruta={selectedRutaId ? rutas.find(r => r.id === selectedRutaId) || null : null}
        onSave={handleDataChange}
      />

      <CreateRutaModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleDataChange}
      />
    </div>
  );
};

export default RutasSection;
