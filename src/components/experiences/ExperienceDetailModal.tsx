import React from 'react';
import { X, User, MapPin, Clock, Users, Star, Globe, Shield, Calendar, Phone, Mail, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface ExperienceDetailData {
  proveedor: {
    id_proveedor: string;
    tipo: string;
    nombre: string;
    descripcion: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    pais: string;
    sitio_web: string;
    rating_promedio: number;
    verificado: boolean;
    fecha_registro: string;
    ubicacion: string;
    redes_sociales: string;
    relevancia: string;
    usuario_creador: string;
    tipo_documento: string;
    numero_documento: string;
    activo: boolean;
  };
  experiencia: {
    id_experiencia: string;
    duracion: number;
    dificultad: string;
    idioma: string;
    incluye_transporte: boolean;
    grupo_maximo: number;
    guia_incluido: boolean;
    equipamiento_requerido: string;
    punto_de_encuentro: string;
    numero_rnt: string;
  };
}

interface ExperienceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceData: ExperienceDetailData | null;
  loading: boolean;
}

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  isOpen,
  onClose,
  experienceData,
  loading
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'fácil': 'bg-green-100 text-green-800 border-green-200',
      'moderado': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'difícil': 'bg-red-100 text-red-800 border-red-200',
      'extremo': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[difficulty.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      'español': 'bg-orange-100 text-orange-800 border-orange-200',
      'inglés': 'bg-blue-100 text-blue-800 border-blue-200',
      'francés': 'bg-purple-100 text-purple-800 border-purple-200',
      'portugués': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[language.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles de la Experiencia
              </h3>
              <p className="text-sm text-gray-600">
                Información completa del proveedor y experiencia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando detalles de la experiencia...</p>
              </div>
            </div>
          ) : experienceData ? (
            <div className="space-y-8">
              {/* Información del Proveedor */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="h-6 w-6 mr-2 text-blue-600" />
                    Información del Proveedor
                  </h4>
                  <div className="flex items-center space-x-2">
                    {experienceData.proveedor.verificado ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="h-4 w-4 mr-1" />
                        No Verificado
                      </span>
                    )}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      experienceData.proveedor.activo 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {experienceData.proveedor.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <p className="text-gray-900 font-semibold">{experienceData.proveedor.nombre}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <p className="text-gray-900 capitalize">{experienceData.proveedor.tipo}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${experienceData.proveedor.email}`} className="text-blue-600 hover:text-blue-800">
                          {experienceData.proveedor.email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${experienceData.proveedor.telefono}`} className="text-blue-600 hover:text-blue-800">
                          {experienceData.proveedor.telefono}
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating Promedio</label>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-900 font-semibold">{experienceData.proveedor.rating_promedio.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{experienceData.proveedor.ciudad}, {experienceData.proveedor.pais}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <p className="text-gray-900">{experienceData.proveedor.direccion}</p>
                    </div>

                    {experienceData.proveedor.sitio_web && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                          <a 
                            href={experienceData.proveedor.sitio_web} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {experienceData.proveedor.sitio_web}
                          </a>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                      <p className="text-gray-900">{experienceData.proveedor.tipo_documento}: {experienceData.proveedor.numero_documento}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Registro</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{formatDate(experienceData.proveedor.fecha_registro)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {experienceData.proveedor.descripcion && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <p className="text-gray-900 bg-white p-4 rounded-lg border">{experienceData.proveedor.descripcion}</p>
                  </div>
                )}
              </div>

              {/* Información de la Experiencia */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <Star className="h-6 w-6 mr-2 text-blue-600" />
                  Detalles de la Experiencia
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duración</label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">{experienceData.experiencia.duracion}h</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grupo Máximo</label>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">{experienceData.experiencia.grupo_maximo} personas</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número RNT</label>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">{experienceData.experiencia.numero_rnt}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(experienceData.experiencia.dificultad)}`}>
                      {experienceData.experiencia.dificultad.charAt(0).toUpperCase() + experienceData.experiencia.dificultad.slice(1)}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLanguageColor(experienceData.experiencia.idioma)}`}>
                      <Globe className="h-4 w-4 mr-1" />
                      {experienceData.experiencia.idioma}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Servicios Incluidos</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${experienceData.experiencia.incluye_transporte ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-700">Transporte</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${experienceData.experiencia.guia_incluido ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-700">Guía</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Punto de Encuentro</label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-gray-900">{experienceData.experiencia.punto_de_encuentro}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipamiento Requerido</label>
                    <p className="text-gray-900">{experienceData.experiencia.equipamiento_requerido}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No se pudieron cargar los detalles</p>
                <p className="text-gray-500">Inténtalo de nuevo más tarde</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};