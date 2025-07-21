import React from 'react';
import ReactDOM from 'react-dom';
import { X, Route, MapPin, Clock, DollarSign, Users, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { RutaModalProps } from '../../types/ruta';

const RutaDetailModal: React.FC<RutaModalProps> = ({ isOpen, onClose, ruta }) => {
  if (!isOpen || !ruta) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Route className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Detalles de la Ruta</h3>
              <p className="text-sm text-gray-500">{ruta.nombre}</p>
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
            {/* Información Básica */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Route className="h-4 w-4 mr-2 text-purple-600" />
                Información Básica
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre</label>
                  <p className="mt-1 text-sm text-gray-900">{ruta.nombre}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descripción</label>
                  <p className="mt-1 text-sm text-gray-900">{ruta.descripcion}</p>
                </div>
              </div>
            </div>

            {/* Ruta y Ubicación */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                Ruta y Ubicación
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-gray-900">{ruta.origen}</p>
                    <p className="text-xs text-gray-500">Origen</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                  <div className="text-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-gray-900">{ruta.destino}</p>
                    <p className="text-xs text-gray-500">Destino</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles de la Ruta */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-600" />
                Detalles de la Ruta
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Duración Estimada</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{ruta.duracion_estimada} minutos</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Precio</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${ruta.precio}</span>
                </div>
              </div>
            </div>

            {/* Puntos de Interés */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-600" />
                Puntos de Interés
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">{ruta.puntos_interes}</p>
              </div>
            </div>

            {/* Estado y Características */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
                Estado y Características
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ruta.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {ruta.activo ? 'Activa' : 'Inactiva'}
                  </span>
                  {ruta.recomendada && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Star className="h-3 w-3 mr-1" />
                      Recomendada
                    </span>
                  )}
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

  return ReactDOM.createPortal(modalContent, document.body);
};

export default RutaDetailModal;
