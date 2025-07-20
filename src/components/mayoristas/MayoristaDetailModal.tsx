import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, FileText, Activity } from 'lucide-react';
import { MayoristaData } from '../../types/mayorista';
import { mayoristaService } from '../../services/mayoristaService';

interface MayoristaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mayoristaId: string | null;
}

const MayoristaDetailModal: React.FC<MayoristaDetailModalProps> = ({
  isOpen,
  onClose,
  mayoristaId,
}) => {
  const [mayorista, setMayorista] = useState<MayoristaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && mayoristaId) {
      fetchMayoristaDetails();
    }
  }, [isOpen, mayoristaId]);

  const fetchMayoristaDetails = async () => {
    if (!mayoristaId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await mayoristaService.getMayoristaById(mayoristaId);
      setMayorista(data);
    } catch (err) {
      setError('Error al cargar los detalles del mayorista');
      console.error('Error fetching mayorista details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Detalles del Mayorista</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={fetchMayoristaDetails}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : mayorista ? (
            <div className="space-y-8">
              {/* Información Básica */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                      <p className="text-gray-900">{mayorista.nombre} {mayorista.apellidos}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Documento</p>
                      <p className="text-gray-900">{mayorista.tipo_documento}: {mayorista.numero_documento}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{mayorista.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="text-gray-900">{mayorista.telefono}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dirección</p>
                      <p className="text-gray-900">{mayorista.direccion}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ubicación</p>
                      <p className="text-gray-900">{mayorista.ciudad}, {mayorista.pais}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Información Adicional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <Activity className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo de Cliente</p>
                      <p className="text-gray-900">{mayorista.recurente ? 'Recurrente' : 'Ocasional'}</p>
                    </div>
                  </div>
                  {mayorista.intereses && (
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Intereses</p>
                        <p className="text-gray-900">{mayorista.intereses}</p>
                      </div>
                    </div>
                  )}
                  {mayorista.descripcion && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <FileText className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Descripción</p>
                        <p className="text-gray-900">{mayorista.descripcion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado y Verificación */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-600" />
                  Estado y Verificación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    {mayorista.activo ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${mayorista.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {mayorista.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    {mayorista.verificado ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Verificación</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mayorista.verificado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mayorista.verificado ? 'Verificado' : 'No verificado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                      <p className="text-gray-900">{mayorista.fecha_creacion ? formatDate(mayorista.fecha_creacion) : 'No disponible'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Última Actualización</p>
                      <p className="text-gray-900">{mayorista.fecha_actualizacion ? formatDate(mayorista.fecha_actualizacion) : 'No disponible'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {mayorista.descripcion && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-600" />
                    Descripción
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{mayorista.descripcion}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MayoristaDetailModal;
