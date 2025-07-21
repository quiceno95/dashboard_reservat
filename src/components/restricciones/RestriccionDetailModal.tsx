import React from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, User, Shield, Server, FileText, Clock } from 'lucide-react';
import { RestriccionModalProps } from '../../types/restriccion';

const RestriccionDetailModal: React.FC<RestriccionModalProps> = ({ isOpen, onClose, restriccion }) => {
  if (!isOpen || !restriccion) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Detalles de la Restricción
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {/* Información General */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Información General
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID de Restricción</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                    {restriccion.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      restriccion.bloqueo_activo
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {restriccion.bloqueo_activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Servicio */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <Server className="h-5 w-5 mr-2 text-purple-500" />
              Servicio Asociado
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID del Servicio</label>
                <p className="mt-1 text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                  {restriccion.servicio_id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                <p className="mt-1 text-sm text-gray-900">
                  {restriccion.servicio_nombre || 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Fecha y Tiempo */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              Fecha y Tiempo
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha Bloqueada</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {restriccion.fecha_formateada}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Días Restantes</label>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {restriccion.dias_hasta_fecha !== undefined ? (
                        restriccion.dias_hasta_fecha > 0 ? (
                          <span className="text-orange-600 font-medium">
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
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Bloqueo */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-500" />
              Información del Bloqueo
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bloqueado Por</label>
                <p className="mt-1 text-sm text-gray-900">
                  {restriccion.bloqueado_por}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Motivo del Bloqueo</label>
                <div className="mt-1 bg-white border rounded-md p-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {restriccion.motivo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
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

export default RestriccionDetailModal;
