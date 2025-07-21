import React from 'react';
import { Search, Eye, Edit, Trash2, Calendar, User, Shield, Clock } from 'lucide-react';
import { RestriccionTableProps } from '../../types/restriccion';

const RestriccionTable: React.FC<RestriccionTableProps> = ({
  restricciones,
  loading,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  searchTerm,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
            disabled={typeof page !== 'number'}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              page === currentPage
                ? 'bg-blue-600 text-white border border-blue-600'
                : typeof page === 'number'
                ? 'border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400'
                : 'text-gray-400 cursor-default'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* Header con título y controles */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Lista de Restricciones ({totalItems} total)
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500">de {totalItems} restricciones</span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar restricciones..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="text-gray-400 hover:text-gray-600 text-sm">✕</span>
            </button>
          )}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bloqueado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Días Restantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restricciones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron restricciones que coincidan con la búsqueda.' : 'No hay restricciones registradas.'}
                  </td>
                </tr>
              ) : (
                restricciones.map((restriccion) => (
                  <tr key={restriccion.id} className="hover:bg-gray-50">
                    {/* Servicio */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {restriccion.servicio_nombre?.charAt(0) || 'S'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {restriccion.servicio_nombre || 'Servicio no especificado'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {restriccion.servicio_id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-y-1">
                        <Calendar className="h-3 w-3 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {restriccion.fecha_formateada}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Motivo */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={restriccion.motivo}>
                        {restriccion.motivo}
                      </div>
                    </td>

                    {/* Bloqueado Por */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-3 w-3 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {restriccion.bloqueado_por}
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        restriccion.bloqueo_activo
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {restriccion.bloqueo_activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Días Restantes */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {restriccion.dias_hasta_fecha !== undefined ? (
                            restriccion.dias_hasta_fecha > 0 ? (
                              <span className="text-orange-600">
                                {restriccion.dias_hasta_fecha} días
                              </span>
                            ) : restriccion.dias_hasta_fecha === 0 ? (
                              <span className="text-red-600 font-medium">Hoy</span>
                            ) : (
                              <span className="text-gray-500">
                                {Math.abs(restriccion.dias_hasta_fecha)} días atrás
                              </span>
                            )
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onView(restriccion.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(restriccion.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(restriccion.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default RestriccionTable;
