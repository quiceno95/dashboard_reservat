import React from 'react';
import ReactDOM from 'react-dom';
import { X, Package, Building, MapPin, DollarSign, Calendar, Star, FileText, Info } from 'lucide-react';
import { ServicioDetailModalProps } from '../../types/servicio';

const ServicioDetailModal: React.FC<ServicioDetailModalProps> = ({ isOpen, onClose, servicio }) => {
  if (!isOpen || !servicio) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detalles del Servicio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre del Servicio</p>
                  <p className="text-lg font-semibold text-gray-900">{servicio.nombre}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Servicio</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {servicio.tipo_servicio}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Proveedor</p>
                  <p className="text-base text-gray-900">{servicio.proveedorNombre}</p>
                  <p className="text-xs text-gray-500">{servicio.proveedor_id}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Precio</p>
                  <p className="text-lg font-semibold text-green-600">{servicio.precioFormateado}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Ubicación</p>
                  <p className="text-base text-gray-900">{servicio.ubicacionCompleta}</p>
                  <p className="text-sm text-gray-600">{servicio.ubicacion}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Relevancia</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    servicio.relevancia === 'Alta' ? 'bg-red-100 text-red-800' :
                    servicio.relevancia === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {servicio.relevancia}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    servicio.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {servicio.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fechas</p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Creado:</span> {servicio.fechaCreacionFormateada}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Actualizado:</span> {servicio.fechaActualizacionFormateada}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">Descripción</p>
                <p className="text-gray-900 leading-relaxed">{servicio.descripcion}</p>
              </div>
            </div>
          </div>

          {/* Detalles del Servicio */}
          {servicio.detalles_del_servicio && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">Detalles del Servicio</p>
                  <p className="text-gray-900 leading-relaxed">{servicio.detalles_del_servicio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Información Técnica */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Información Técnica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">ID del Servicio:</span>
                <p className="text-gray-600 break-all">{servicio.id_servicio}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">ID del Proveedor:</span>
                <p className="text-gray-600 break-all">{servicio.proveedor_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ServicioDetailModal;
