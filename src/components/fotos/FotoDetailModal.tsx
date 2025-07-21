import React from 'react';
import ReactDOM from 'react-dom';
import { X, Camera, Building, Link, FileText, Hash, Star, Calendar, Trash2 } from 'lucide-react';
import { FotoDetailModalProps } from '../../types/foto';

const FotoDetailModal: React.FC<FotoDetailModalProps> = ({ isOpen, onClose, foto }) => {
  if (!isOpen || !foto) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Detalle de Foto</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="mt-4 space-y-6">
          {/* Imagen */}
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <img
                src={foto.url}
                alt={foto.descripcion}
                className="w-full h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTgwQzIyMCAxODAgMjQwIDE2MCAyNDAgMTQwQzI0MCAxMjAgMjIwIDEwMCAyMDAgMTAwQzE4MCAxMDAgMTYwIDEyMCAxNjAgMTQwQzE2MCAxNjAgMTgwIDE4MCAyMDAgMTgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAwIDE2MEMyMTAgMTYwIDIyMCAxNTAgMjIwIDE0MEMyMjAgMTMwIDIxMCAxMjAgMjAwIDEyMEMxOTAgMTIwIDE4MCAxMzAgMTgwIDE0MEMxODAgMTUwIDE5MCAxNjAgMjAwIDE2MFoiIGZpbGw9IiNGOUZBRkIiLz4KPHR4dCB4PSIyMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdHh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
          </div>

          {/* Información de la foto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Servicio</dt>
                  <dd className="mt-1 text-sm text-gray-900">{foto.servicioNombre}</dd>
                  <dd className="text-xs text-gray-500">{foto.servicio_id}</dd>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Link className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">URL</dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">
                    <a 
                      href={foto.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {foto.url}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                  <dd className="mt-1 text-sm text-gray-900">{foto.descripcion}</dd>
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Orden</dt>
                  <dd className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      #{foto.orden}
                    </span>
                  </dd>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Foto de Portada</dt>
                  <dd className="mt-1">
                    {foto.es_portada ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </dd>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de Subida</dt>
                  <dd className="mt-1 text-sm text-gray-900">{foto.fechaFormateada}</dd>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Trash2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        !foto.eliminado
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {!foto.eliminado ? 'Activa' : 'Eliminada'}
                    </span>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default FotoDetailModal;
