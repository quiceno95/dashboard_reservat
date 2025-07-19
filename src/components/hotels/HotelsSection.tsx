import React, { useEffect, useState } from 'react';
import { hotelService } from '../../services/hotelService';
import { HotelUnificado } from '../../types/hotel';
import { HotelTable } from './HotelTable';
import { HotelDetailModal } from './HotelDetailModal';
import { EditHotelModal } from './EditHotelModal';
import { Download, Plus, Hotel, CheckCircle, LayoutList, Search, X } from 'lucide-react';

export const HotelsSection: React.FC = () => {
  const [hotels, setHotels] = useState<HotelUnificado[]>([]);
  const [filtered, setFiltered] = useState<HotelUnificado[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editHotelId, setEditHotelId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getHotels(1, 300);
        setHotels(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error loading hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleViewHotel = (id: string) => {
    setSelectedHotelId(id);
    setDetailOpen(true);
  };

  const handleEditHotel = (id: string) => {
    setEditHotelId(id);
    setEditOpen(true);
  };

  const handleEditSuccess = () => {
    // Recargar la lista de hoteles después de editar
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getHotels(1, 300);
        setHotels(data);
        setFiltered(data);
      } catch (e) {
        console.error('Error recargando hoteles', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  };

  // Filtrar en memoria (barra de búsqueda global)
  useEffect(() => {
    const term = search.toLowerCase();
    const res = hotels.filter(h =>
      `${h.nombre_proveedor} ${h.ciudad} ${h.pais}`.toLowerCase().includes(term)
    );
    setFiltered(res);
    setCurrentPage(1);
  }, [search, hotels]);

  // Estadísticas (pueden ser estáticas o simples conteos)
  const total = hotels.length;
  const verificadas = hotels.filter(h => h.verificado).length;
  const recep24 = hotels.filter(h => h.recepcion_24_horas).length;
  const conPiscina = hotels.filter(h => h.piscina).length;

  return (
    <div className="space-y-8">
      {/* Encabezado y botones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Hoteles</h1>
          <p className="text-gray-600 mt-2">Administra todos los hoteles del sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            <Download className="h-5 w-5" />
            <span>Exportar Hoteles</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="h-5 w-5" />
            <span>Crear Hotel</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total */}
        <div className="bg-blue-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Hoteles</p>
              <p className="text-3xl font-bold text-blue-600">{total}</p>
            </div>
            <Hotel className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        {/* Verificados */}
        <div className="bg-green-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hoteles Verificados</p>
              <p className="text-3xl font-bold text-green-600">{verificadas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        {/* Recepción 24h */}
        <div className="bg-orange-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recepción 24 horas</p>
              <p className="text-3xl font-bold text-orange-600">{recep24}</p>
            </div>
            <LayoutList className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        {/* Con piscina */}
        <div className="bg-purple-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hoteles con Piscina</p>
              <p className="text-3xl font-bold text-purple-600">{conPiscina}</p>
            </div>
            <LayoutList className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Lista de Hoteles en tarjeta */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      {/* Barra de búsqueda y título */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista de Hoteles ({total} total)</h3>
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${search ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <input
          type="text"
          placeholder="Buscar hoteles por proveedor, ciudad, país..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`block w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            search ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
          }`}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            title="Limpiar búsqueda"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <p>Cargando hoteles...</p>
      ) : (
        <HotelTable
          hotels={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          onView={handleViewHotel}
          onEdit={handleEditHotel}
        />
      )}

      {/* Paginación */}
      {!loading && filtered.length > pageSize && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Mostrar:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {Math.ceil(filtered.length / pageSize)}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filtered.length / pageSize), p + 1))}
              disabled={currentPage === Math.ceil(filtered.length / pageSize)}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Fin tarjeta lista */}
      </div>

      {/* Modal detalle */}
      {selectedHotelId && (
        <HotelDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          hotelId={selectedHotelId}
        />
      )}

      {editHotelId && (
        <EditHotelModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          hotelId={editHotelId}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Gráficas sugeridas (placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="h-64 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
          Aquí irá el gráfico de barras de distribución de estrellas
        </div>
        <div className="h-64 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
          Aquí irá el gráfico donut de hoteles con/sin piscina
        </div>
      </div>
    </div>
  );
};
