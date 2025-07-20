import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, MapPin, Star, Eye, Edit, Trash2, Building, Phone, Mail } from 'lucide-react';
import { HotelUnificado } from '../../types/hotel';

interface HotelTableProps {
  hotels: HotelUnificado[];
  searchTerm: string;
  isSearching: boolean;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalHotels: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HotelTable: React.FC<HotelTableProps> = ({
  hotels,
  searchTerm,
  isSearching,
  onSearchChange,
  onClearSearch,
  loading,
  currentPage,
  totalPages,
  totalHotels,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const safeHotels = Array.isArray(hotels) ? hotels : [];
  const displayHotels = safeHotels;
  // Funciones auxiliares
  const getVerificationBadge = (isVerified: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isVerified 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isVerified ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Verificado
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            No Verificado
          </>
        )}
      </span>
    );
  };

  const getStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating}</span>
      </div>
    );
  };

  const getServiceBadge = (hasService: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        hasService
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {hasService ? 'Sí' : 'No'}
      </span>
    );
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      onSearchChange(value);
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onClearSearch();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isSearching ? (
              <span>
                Resultados de búsqueda: <span className="text-blue-600">{totalHotels}</span> hoteles encontrados
                {searchTerm && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    para "{searchTerm}"
                  </span>
                )}
              </span>
            ) : (
              `Lista de Hoteles (${totalHotels} total)`
            )}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">por página</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${isSearching ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            placeholder="Buscar hoteles por proveedor, ciudad, país..."
            value={localSearchTerm}
            onChange={handleLocalSearchChange}
            className={`block w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              isSearching ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
            }`}
          />
          {(localSearchTerm || isSearching) && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              title="Limpiar búsqueda"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {isSearching && (
          <div className="mt-2 text-sm text-blue-600 flex items-center">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Buscando en toda la base de datos...
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicios
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayHotels.map((hotel) => (
              <tr key={hotel.id_hotel} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {hotel.nombre_proveedor.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {hotel.nombre_proveedor}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {hotel.email || 'N/A'}
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-600">
                          {hotel.telefono || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <div>
                      <div>{hotel.ciudad}</div>
                      <div className="text-xs text-gray-500">{hotel.pais}</div>
                    </div>
                  </div>
                </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {getStarRating(hotel.estrellas || 0)}
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-3 w-3 mr-1" />
                    {hotel.numero_habitaciones || 0} habitaciones
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">24h:</span>
                    {getServiceBadge(hotel.recepcion_24_horas || false)}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">Piscina:</span>
                    {getServiceBadge(hotel.piscina || false)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getVerificationBadge(hotel.verificado || false)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="space-y-1">
                  <div className="text-xs font-medium">{hotel.tipo_documento || 'N/A'}</div>
                  <div className="text-xs text-gray-400">{hotel.numero_documento || 'N/A'}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(hotel.id_hotel)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(hotel.id_hotel)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                    title="Editar hotel"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(hotel.id_hotel);
                    }}
                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Eliminar hotel"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {displayHotels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {isSearching || searchTerm ? (
                <div>
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</p>
                  <p className="text-gray-500">
                    No hay hoteles que coincidan con "{searchTerm || localSearchTerm}"
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                'No hay hoteles registrados'
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, totalHotels)} de {totalHotels} hoteles
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </button>
              
              <div className="flex items-center space-x-1">
                {generatePageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-sm text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => onPageChange(page as number)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
