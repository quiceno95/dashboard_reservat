import React, { useState, useEffect } from 'react';
import { Download, Plus, UtensilsCrossed } from 'lucide-react';
import { RestauranteData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';
import RestauranteTable from './RestauranteTable';
import RestauranteStats from './RestauranteStats';
import RestauranteCharts from './RestauranteCharts';
import RestauranteDetailModal from './RestauranteDetailModal';
import EditRestauranteModal from './EditRestauranteModal';
import CreateRestauranteModal from './CreateRestauranteModal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const RestaurantesSection: React.FC = () => {
  // Estados principales
  const [restaurantes, setRestaurantes] = useState<RestauranteData[]>([]);
  const [filteredRestaurantes, setFilteredRestaurantes] = useState<RestauranteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Estados de modales
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRestauranteId, setSelectedRestauranteId] = useState<string | null>(null);

  // Cargar restaurantes
  const loadRestaurantes = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await restauranteService.getRestaurantes(page - 1, size);
      
      setRestaurantes(response.restaurantes);
      setFilteredRestaurantes(response.restaurantes);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Error loading restaurantes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los restaurantes'
      });
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadRestaurantes();
    // Simular carga de stats y charts
    setTimeout(() => setStatsLoading(false), 1000);
    setTimeout(() => setChartsLoading(false), 1200);
  }, []);

  // Efecto para recargar cuando cambia la página o el tamaño
  useEffect(() => {
    if (currentPage > 0) {
      loadRestaurantes(currentPage, pageSize);
    }
  }, [currentPage, pageSize]);

  // Manejar búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    if (term.trim() === '') {
      setFilteredRestaurantes(restaurantes);
    } else {
      const filtered = restaurantes.filter(restaurante =>
        restaurante.nombre.toLowerCase().includes(term.toLowerCase()) ||
        restaurante.ciudad.toLowerCase().includes(term.toLowerCase()) ||
        restaurante.tipo_cocina.toLowerCase().includes(term.toLowerCase()) ||
        restaurante.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRestaurantes(filtered);
    }
    
    setTimeout(() => setIsSearching(false), 300);
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Manejar ver detalles
  const handleViewDetails = (id: string) => {
    setSelectedRestauranteId(id);
    setDetailModalOpen(true);
  };

  // Manejar editar
  const handleEdit = (id: string) => {
    setSelectedRestauranteId(id);
    setEditModalOpen(true);
  };

  // Manejar eliminar
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de eliminar este restaurante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await restauranteService.deleteRestaurante(id);
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Restaurante eliminado exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
        loadRestaurantes();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar el restaurante'
        });
      }
    }
  };

  // Manejar crear restaurante
  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    loadRestaurantes();
    Swal.fire({
      icon: 'success',
      title: 'Creado',
      text: 'Restaurante creado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Manejar editar restaurante
  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedRestauranteId(null);
    loadRestaurantes();
    Swal.fire({
      icon: 'success',
      title: 'Actualizado',
      text: 'Restaurante actualizado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Exportar a Excel
  const handleExport = async () => {
    try {
      const { restaurantes: allRestaurantes } = await restauranteService.getRestaurantes(0, 1000);
      
      const exportData = allRestaurantes.map(restaurante => ({
        'Nombre': restaurante.nombre,
        'Email': restaurante.email,
        'Teléfono': restaurante.telefono,
        'Ciudad': restaurante.ciudad,
        'País': restaurante.pais,
        'Tipo de Cocina': restaurante.tipo_cocina,
        'Horario Apertura': restaurante.horario_apertura,
        'Horario Cierre': restaurante.horario_cierre,
        'Capacidad': restaurante.capacidad,
        'Aforo Máximo': restaurante.aforo_maximo,
        'Verificado': restaurante.verificado ? 'Sí' : 'No',
        'Pet Friendly': restaurante.pet_friendly ? 'Sí' : 'No',
        'WiFi': restaurante.wifi ? 'Sí' : 'No',
        'Parqueadero': restaurante.parqueadero ? 'Sí' : 'No',
        'Entrega a Domicilio': restaurante.entrega_a_domicilio ? 'Sí' : 'No',
        'Terraza': restaurante.terraza ? 'Sí' : 'No',
        'Apto Celíacos': restaurante.apto_celiacos ? 'Sí' : 'No',
        'Apto Vegetarianos': restaurante.apto_vegetarianos ? 'Sí' : 'No',
        'Menú Vegano': restaurante.menu_vegana ? 'Sí' : 'No',
        'Eventos': restaurante.eventos ? 'Sí' : 'No',
        'Catering': restaurante.catering ? 'Sí' : 'No',
        'Tipo Documento': restaurante.tipo_documento,
        'Número Documento': restaurante.numero_documento,
        'Dirección': restaurante.direccion,
        'Sitio Web': restaurante.sitio_web,
        'Rating': restaurante.rating_promedio,
        'Fecha Registro': new Date(restaurante.fecha_registro).toLocaleDateString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      
      // Configurar anchos de columna
      const colWidths = [
        { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
        { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 18 },
        { wch: 10 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 10 },
        { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 40 }, { wch: 30 },
        { wch: 10 }, { wch: 15 }
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Restaurantes');
      XLSX.writeFile(workbook, 'restaurantes.xlsx');

      Swal.fire({
        icon: 'success',
        title: 'Exportado',
        text: 'Datos exportados exitosamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al exportar los datos'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <UtensilsCrossed className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Restaurantes</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona los restaurantes y su información
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Restaurantes
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Restaurante
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <RestauranteStats loading={statsLoading} />

      {/* Tabla de restaurantes */}
      <RestauranteTable
        restaurantes={filteredRestaurantes}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Gráficos */}
      <RestauranteCharts loading={chartsLoading} />

      {/* Modales */}
      {detailModalOpen && selectedRestauranteId && (
        <RestauranteDetailModal
          restauranteId={selectedRestauranteId}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedRestauranteId(null);
          }}
        />
      )}

      {editModalOpen && selectedRestauranteId && (
        <EditRestauranteModal
          restauranteId={selectedRestauranteId}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedRestauranteId(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {createModalOpen && (
        <CreateRestauranteModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default RestaurantesSection;
