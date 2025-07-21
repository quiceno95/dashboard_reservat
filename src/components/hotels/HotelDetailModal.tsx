import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { hotelService } from '../../services/hotelService';
import {
  X,
  Building2,
  User,
  MapPin,
  Mail,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  Bed,
  Clock,
  DollarSign,
  Car,
  Coffee,
  Utensils,
  Heart,
  Waves,
  Home,
  ArrowUpDown,
  Accessibility,
  Mic,
  Zap,
  Globe,
  Share2,
  FileText,
  Calendar
} from 'lucide-react';

interface Props {
  hotelId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HotelDetailModal: React.FC<Props> = ({ hotelId, isOpen, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId || !isOpen) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await hotelService.getHotelById(hotelId);
        setData(res);
      } catch (e: any) {
        setError(e.message || 'Error al cargar hotel');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [hotelId, isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles del Hotel
              </h3>
              <p className="text-sm text-gray-600">
                Información completa del proveedor y hotel
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
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando detalles del hotel...</p>
              </div>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : data ? (
            <div className="space-y-8">
              {/* Información del Proveedor */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="h-6 w-6 mr-2 text-green-600" />
                    Información del Proveedor
                  </h4>
                  <div className="flex items-center space-x-2">
                    {data.proveedor?.verificado ? (
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Nombre:</span>
                      <span>{data.proveedor?.nombre}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Ubicación:</span>
                      <span>{data.proveedor?.ciudad}, {data.proveedor?.pais}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Email:</span>
                      <span>{data.proveedor?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Teléfono:</span>
                      <span>{data.proveedor?.telefono}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Dirección:</span>
                      <span>{data.proveedor?.direccion}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Ubicación:</span>
                      <span>{data.proveedor?.ubicacion}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Relevancia:</span>
                      <span>{data.proveedor?.relevancia}</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">Rating:</span>
                      <span>{data.proveedor?.rating_promedio}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Sitio Web:</span>
                      <a href={data.proveedor?.sitio_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                        {data.proveedor?.sitio_web}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Share2 className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium">Redes Sociales:</span>
                      <a href={data.proveedor?.redes_sociales} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                        {data.proveedor?.redes_sociales}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-slate-600" />
                      <span className="font-medium">Documento:</span>
                      <span>{data.proveedor?.tipo_documento}: {data.proveedor?.numero_documento}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Usuario Creador:</span>
                      <span>{data.proveedor?.usuario_creador}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Fecha Registro:</span>
                      <span>{new Date(data.proveedor?.fecha_registro).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>

                {data.proveedor?.descripcion && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <p className="text-gray-900 bg-white p-4 rounded-lg border text-sm">
                      {data.proveedor.descripcion}
                    </p>
                  </div>
                )}
              </div>

              {/* Información del Hotel */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <Building2 className="h-6 w-6 mr-2 text-green-600" />
                  Detalles del Hotel
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">Estrellas:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.estrellas}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bed className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-700">Habitaciones:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.numero_habitaciones}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Home className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-gray-700">Tipo Habitación:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.tipo_habitacion}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-700">Check-in:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.check_in}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-gray-700">Check-out:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.check_out}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-700">Precio Base:</span>
                    </div>
                    <div className="ml-6">${data.hotel?.precio_ascendente}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium text-gray-700">Recepción 24h:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.recepcion_24_horas ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Waves className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-gray-700">Piscina:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.piscina ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span className="font-medium text-gray-700">Pet Friendly:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.pet_friendly ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-gray-700">Mascotas:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.admite_mascotas ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Car className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-700">Estacionamiento:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.tiene_estacionamiento ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Utensils className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-gray-700">Restaurante:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.servicio_restaurante ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Coffee className="h-4 w-4 text-brown-500" />
                      <span className="font-medium text-gray-700">Bar:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.bar ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Utensils className="h-4 w-4 text-teal-500" />
                      <span className="font-medium text-gray-700">Room Service:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.room_service ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowUpDown className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-gray-700">Ascensor:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.asensor ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Accessibility className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-700">Rampa Discapacitados:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.rampa_discapacitado ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mic className="h-4 w-4 text-violet-500" />
                      <span className="font-medium text-gray-700">Auditorio:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.auditorio ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Car className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium text-gray-700">Parqueadero:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.parqueadero ? 'Sí' : 'No'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-gray-700">Planta Energía:</span>
                    </div>
                    <div className="ml-6">{data.hotel?.planta_energia ? 'Sí' : 'No'}</div>
                  </div>
                </div>

                {data.hotel?.servicios_incluidos && (
                  <div className="mt-6 bg-white p-4 rounded-lg border">
                    <span className="font-medium text-gray-700 block mb-2">Servicios Incluidos:</span>
                    <p className="text-gray-900">{data.hotel.servicios_incluidos}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
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

  return ReactDOM.createPortal(modalContent, document.body);
};
