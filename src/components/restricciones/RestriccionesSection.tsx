import React, { useState, useEffect } from 'react';
import { Plus, Download, Shield } from 'lucide-react';
import { RestriccionData, RestriccionStatsData, RestriccionChartData } from '../../types/restriccion';
import { restriccionService } from '../../services/restriccionService';
import RestriccionTable from './RestriccionTable';
import RestriccionStats from './RestriccionStats';
import RestriccionCharts from './RestriccionCharts';
import RestriccionDetailModal from './RestriccionDetailModal';
import EditRestriccionModal from './EditRestriccionModal';
import CreateRestriccionModal from './CreateRestriccionModal';
import Swal from 'sweetalert2';

const RestriccionesSection: React.FC = () => {
  // Estados principales
  const [restricciones, setRestricciones] = useState<RestriccionData[]>([]);
  const [filteredRestricciones, setFilteredRestricciones] = useState<RestriccionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para estadísticas y gráficos
  const [stats, setStats] = useState<RestriccionStatsData>({
    totalRestricciones: 0,
    restriccionesActivas: 0,
    restriccionesMesActual: 0,
    serviciosConRestricciones: 0
  });
  const [chartData, setChartData] = useState<RestriccionChartData>({
    estados: [],
    bloqueosPorMes: []
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Estados para modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRestriccionId, setSelectedRestriccionId] = useState<string | null>(null);

  // Cargar restricciones
  const loadRestricciones = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await restriccionService.getRestricciones(page - 1, size); // API usa paginación 0-based
      
      const processedData = restriccionService.processRestriccionesForUI(response.fechas_bloqueadas);
      setRestricciones(processedData);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / size));
      
      // Si no hay búsqueda activa, usar los datos paginados de la API
      if (!searchTerm) {
        setFilteredRestricciones(processedData);
      }
      
    } catch (error) {
      console.error('Error loading restricciones:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar las restricciones',
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
      const statsData = await restriccionService.calculateStats();
      setStats(statsData);
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
      const chartData = await restriccionService.generateChartData();
      setChartData(chartData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setChartsLoading(false);
    }
  };

  // Filtrado local para búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = restricciones.filter(restriccion =>
        restriccion.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restriccion.bloqueado_por.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restriccion.servicio_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restriccion.fecha_formateada.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestricciones(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize));
    } else {
      setFilteredRestricciones(restricciones);
      // NO llamar loadRestricciones aquí para evitar bucle infinito
    }
  }, [searchTerm, restricciones, pageSize]);

  // Cargar datos iniciales
  useEffect(() => {
    loadRestricciones();
    loadStats();
    loadChartData();
  }, []);

  // Cargar restricciones cuando cambie la página o el tamaño de página (solo si no hay búsqueda activa)
  useEffect(() => {
    if (!searchTerm) {
      loadRestricciones(currentPage, pageSize);
    }
  }, [currentPage, pageSize]);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleView = (id: string) => {
    setSelectedRestriccionId(id);
    setDetailModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRestriccionId(id);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await restriccionService.deleteRestriccion(id);
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La restricción ha sido eliminada correctamente',
          timer: 2000,
          showConfirmButton: false
        });

        await loadRestricciones();
        await loadStats();
        await loadChartData();
      }
    } catch (error) {
      console.error('Error al eliminar restricción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la restricción. Por favor, intenta de nuevo.',
      });
    }
  };

  const handleExport = async () => {
    try {
      await restriccionService.exportToExcel();
      Swal.fire({
        icon: 'success',
        title: 'Exportación exitosa',
        text: 'El archivo Excel ha sido descargado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la exportación',
        text: 'No se pudo exportar el archivo. Por favor, intenta de nuevo.',
      });
    }
  };

  const handleModalSave = async () => {
    await loadRestricciones();
    await loadStats();
    await loadChartData();
  };

  const selectedRestriccion = selectedRestriccionId 
    ? restricciones.find(r => r.id === selectedRestriccionId) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-red-600" />
            Gestión de Restricciones
          </h1>
          <p className="text-gray-600">Administra las fechas bloqueadas del sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Restricciones
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Restricción
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <RestriccionStats stats={stats} loading={statsLoading} />

      {/* Tabla */}
      <RestriccionTable
        restricciones={filteredRestricciones}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        searchTerm={searchTerm}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Gráficos */}
      <RestriccionCharts data={chartData} loading={chartsLoading} />

      {/* Modales */}
      <RestriccionDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        restriccion={selectedRestriccion}
      />

      <EditRestriccionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        restriccion={selectedRestriccion}
        onSave={handleModalSave}
      />

      <CreateRestriccionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default RestriccionesSection;
