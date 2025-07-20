import React from 'react';
import { X, Car, User, Mail, Phone, MapPin, Globe, Star, Shield, Wifi, Users, Calendar, Fuel } from 'lucide-react';
import { TransporteModalProps } from '../../types/transporte';

const TransporteDetailModal: React.FC<TransporteModalProps> = ({ isOpen, onClose, transporte }) => {
  if (!isOpen || !transporte) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Detalles del Transporte</h3>
              <p className="text-sm text-gray-500">{transporte.proveedor.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {/* Información del Proveedor */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                Información del Proveedor
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.proveedor.nombre}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.proveedor.tipo}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descripción</label>
                  <p className="mt-1 text-sm text-gray-900">{transporte.proveedor.descripcion}</p>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-600" />
                Información de Contacto
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="text-sm text-gray-900">{transporte.proveedor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</label>
                      <p className="text-sm text-gray-900">{transporte.proveedor.telefono}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sitio Web</label>
                    <p className="text-sm text-gray-900">{transporte.proveedor.sitio_web}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-600" />
                Ubicación
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ciudad</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.proveedor.ciudad}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">País</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.proveedor.pais}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dirección</label>
                  <p className="mt-1 text-sm text-gray-900">{transporte.proveedor.direccion}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ubicación Específica</label>
                  <p className="mt-1 text-sm text-gray-900">{transporte.proveedor.ubicacion}</p>
                </div>
              </div>
            </div>

            {/* Información del Vehículo */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Car className="h-4 w-4 mr-2 text-purple-600" />
                Información del Vehículo
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo de Vehículo</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.transporte.tipo_vehiculo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Modelo</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.transporte.modelo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Año</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.transporte.anio}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Placa</label>
                    <p className="mt-1 text-sm text-gray-900">{transporte.transporte.placa}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Capacidad</label>
                      <p className="text-sm text-gray-900">{transporte.transporte.capacidad} personas</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Combustible</label>
                      <p className="text-sm text-gray-900">{transporte.transporte.combustible}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado y Características */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-indigo-600" />
                Estado y Características
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transporte.transporte.disponible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transporte.transporte.disponible ? 'Disponible' : 'No Disponible'}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transporte.transporte.seguro_vigente
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {transporte.transporte.seguro_vigente ? 'Seguro Vigente' : 'Sin Seguro'}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transporte.proveedor.verificado
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {transporte.proveedor.verificado ? 'Verificado' : 'No Verificado'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {transporte.transporte.aire_acondicionado && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Aire acondicionado
                    </div>
                  )}
                  {transporte.transporte.wifi && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Wifi className="h-4 w-4 mr-2 text-purple-500" />
                      WiFi disponible
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Último mantenimiento: {new Date(transporte.transporte.fecha_mantenimiento).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Información Adicional</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating Promedio:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{transporte.proveedor.rating_promedio}/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fecha de Registro:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(transporte.proveedor.fecha_registro).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documento:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {transporte.proveedor.tipo_documento}: {transporte.proveedor.numero_documento}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
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
};

export default TransporteDetailModal;
