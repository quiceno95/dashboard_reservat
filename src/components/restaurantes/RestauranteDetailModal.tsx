import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Mail, Globe, Clock, Users, Star, Utensils, Wifi, Car, Heart, Truck, CheckCircle, XCircle, Calendar, User, FileText, Hash } from 'lucide-react';
import { RestauranteData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';

interface RestauranteDetailModalProps {
  restauranteId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RestauranteDetailModal: React.FC<RestauranteDetailModalProps> = ({
  restauranteId,
  isOpen,
  onClose
}) => {
  const [restaurante, setRestaurante] = useState<RestauranteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && restauranteId) {
      loadRestauranteDetails();
    }
  }, [isOpen, restauranteId]);

  const loadRestauranteDetails = async () => {
    try {
      setLoading(true);
      const data = await restauranteService.getRestauranteById(restauranteId);
      setRestaurante(data);
    } catch (error) {
      console.error('Error loading restaurante details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  const renderServiceBadge = (label: string, value: boolean, icon: React.ReactNode) => (
    <div className={`flex items-center space-x-2 p-2 rounded-lg ${value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {value ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : restaurante ? (
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{restaurante.nombre}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(restaurante.rating_promedio)}
                      <span className="text-sm text-gray-500">({restaurante.rating_promedio}/5)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del Proveedor */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Información del Proveedor</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{restaurante.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{restaurante.telefono}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {restaurante.direccion}, {restaurante.ciudad}, {restaurante.pais}
                      </span>
                    </div>
                    
                    {restaurante.sitio_web && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <a
                          href={restaurante.sitio_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {restaurante.sitio_web}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{restaurante.tipo_documento}: {restaurante.numero_documento}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">Creado por: {restaurante.usuario_creador}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        Registrado: {new Date(restaurante.fecha_registro).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h5 className="text-md font-medium text-gray-900 mb-2">Estado</h5>
                    <div className="flex space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          restaurante.verificado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {restaurante.verificado ? 'Verificado' : 'No verificado'}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          restaurante.activo
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {restaurante.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información del Restaurante */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Información del Restaurante</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Utensils className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">Tipo de cocina: {restaurante.tipo_cocina}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Hash className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">Tipo de comida: {restaurante.tipo_comida}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        Horario: {restaurante.horario_apertura} - {restaurante.horario_cierre}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        Capacidad: {restaurante.capacidad} | Aforo máximo: {restaurante.aforo_maximo}
                      </span>
                    </div>
                    
                    {restaurante.menu_url && (
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <a
                          href={restaurante.menu_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Ver menú
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <h5 className="text-md font-medium text-gray-900 mb-3">Opciones Alimentarias</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {renderServiceBadge('Apto Celíacos', restaurante.apto_celiacos, <CheckCircle className="h-4 w-4" />)}
                      {renderServiceBadge('Apto Vegetarianos', restaurante.apto_vegetarianos, <CheckCircle className="h-4 w-4" />)}
                      {renderServiceBadge('Menú Vegano', restaurante.menu_vegana, <CheckCircle className="h-4 w-4" />)}
                      {renderServiceBadge('Menú Infantil', restaurante.menu_infantil, <CheckCircle className="h-4 w-4" />)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Servicios y Características */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Servicios y Características</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {renderServiceBadge('WiFi', restaurante.wifi, <Wifi className="h-4 w-4" />)}
                  {renderServiceBadge('Parqueadero', restaurante.parqueadero, <Car className="h-4 w-4" />)}
                  {renderServiceBadge('Pet Friendly', restaurante.pet_friendly, <Heart className="h-4 w-4" />)}
                  {renderServiceBadge('Entrega a Domicilio', restaurante.entrega_a_domicilio, <Truck className="h-4 w-4" />)}
                  {renderServiceBadge('Terraza', restaurante.terraza, <MapPin className="h-4 w-4" />)}
                  {renderServiceBadge('Eventos', restaurante.eventos, <Calendar className="h-4 w-4" />)}
                  {renderServiceBadge('Catering', restaurante.catering, <Utensils className="h-4 w-4" />)}
                  {renderServiceBadge('Bufete', restaurante.bufete, <Utensils className="h-4 w-4" />)}
                  {renderServiceBadge('Zonas Comunes', restaurante.zonas_comunes, <Users className="h-4 w-4" />)}
                  {renderServiceBadge('Auditorio', restaurante.auditorio, <Users className="h-4 w-4" />)}
                  {renderServiceBadge('Sillas de Bebé', restaurante.sillas_bebe, <Users className="h-4 w-4" />)}
                  {renderServiceBadge('Rampa Discapacitados', restaurante.rampa_discapacitados, <CheckCircle className="h-4 w-4" />)}
                </div>
              </div>

              {/* Descripción */}
              {restaurante.descripcion && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Descripción</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{restaurante.descripcion}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No se pudo cargar la información del restaurante</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestauranteDetailModal;
