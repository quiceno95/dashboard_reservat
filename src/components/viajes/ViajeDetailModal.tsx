import React from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, MapPin, Users, DollarSign, User, Clock, CheckCircle, XCircle, Route, Truck } from 'lucide-react';
import { ViajeDetailModalProps, ESTADOS_VIAJE } from '../../types/viaje';

const ViajeDetailModal: React.FC<ViajeDetailModalProps> = ({ isOpen, onClose, viaje }) => {
  if (!isOpen || !viaje) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getEstadoBadge = (estado: string | undefined) => {
    if (!estado) return <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600">Sin estado</span>;

    const badgeClasses = {
      [ESTADOS_VIAJE.PROGRAMADO]: 'bg-blue-100 text-blue-800',
      [ESTADOS_VIAJE.EN_CURSO]: 'bg-yellow-100 text-yellow-800',
      [ESTADOS_VIAJE.FINALIZADO]: 'bg-green-100 text-green-800',
      [ESTADOS_VIAJE.CANCELADO]: 'bg-red-100 text-red-800'
    };

    const className = badgeClasses[estado as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-600';
    
    return (
      <span className={`px-3 py-1 text-sm rounded-full ${className}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detalles del Viaje</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Información General */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Información General</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Fecha de Inicio</p>
                  <p className="text-sm text-gray-600">{formatDate(viaje.fecha_inicio)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Fecha de Fin</p>
                  <p className="text-sm text-gray-600">{formatDate(viaje.fecha_fin)}</p>
                </div>
              </div>
              {viaje.duracion_dias && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duración</p>
                    <p className="text-sm text-gray-600">{viaje.duracion_dias} días</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <div className="mr-3">
                  {viaje.activo ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Estado del Viaje</p>
                  <p className="text-sm text-gray-600">{viaje.activo ? 'Activo' : 'Inactivo'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Capacidad y Precio */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Capacidad y Precio</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Capacidad Total</p>
                  <p className="text-sm text-gray-600">{viaje.capacidad_total || 0} pasajeros</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Capacidad Disponible</p>
                  <p className="text-sm text-gray-600">{viaje.capacidad_disponible || 0} pasajeros</p>
                </div>
              </div>
              {viaje.ocupacion_porcentaje !== undefined && (
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ocupación</p>
                    <p className="text-sm text-gray-600">{viaje.ocupacion_porcentaje}%</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Precio</p>
                  <p className="text-sm text-gray-600">{formatPrice(viaje.precio)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Asignaciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Asignaciones</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Guía Asignado</p>
                  <p className="text-sm text-gray-600">{viaje.guia_asignado || 'Sin asignar'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Route className="h-5 w-5 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Ruta</p>
                  <p className="text-sm text-gray-600">
                    {viaje.ruta_nombre || viaje.ruta_id || 'No especificada'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Transportador</p>
                  <p className="text-sm text-gray-600">
                    {viaje.transportador_nombre || viaje.id_transportador || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Estado del Viaje</p>
                  <div className="mt-1">
                    {getEstadoBadge(viaje.estado)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IDs Técnicos */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Información Técnica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">ID del Viaje</p>
                <p className="text-xs text-gray-500 font-mono">{viaje.id}</p>
              </div>
              {viaje.ruta_id && (
                <div>
                  <p className="text-sm font-medium text-gray-700">ID de la Ruta</p>
                  <p className="text-xs text-gray-500 font-mono">{viaje.ruta_id}</p>
                </div>
              )}
              {viaje.id_transportador && (
                <div>
                  <p className="text-sm font-medium text-gray-700">ID del Transportador</p>
                  <p className="text-xs text-gray-500 font-mono">{viaje.id_transportador}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ViajeDetailModal;
