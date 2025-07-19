import React, { useState, useEffect } from 'react';
import { X, Building2, User, Save } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import { ProveedorHotel, HotelInfo } from '../../types/hotel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  onSuccess: () => void;
}

interface HotelData {
  proveedor: ProveedorHotel;
  hotel: HotelInfo;
}

export const EditHotelModal: React.FC<Props> = ({ isOpen, onClose, hotelId, onSuccess }) => {
  const [data, setData] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && hotelId) {
      loadHotelData();
    }
  }, [isOpen, hotelId]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.getHotelById(hotelId);
      setData(response);
    } catch (err) {
      setError('Error al cargar los datos del hotel');
      console.error('Error loading hotel:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setError(null);
      await hotelService.updateHotel(hotelId, data);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error('Error saving hotel:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateProveedorField = (field: keyof ProveedorHotel, value: any) => {
    if (!data) return;
    setData({
      ...data,
      proveedor: {
        ...data.proveedor,
        [field]: value
      }
    });
  };

  const updateHotelField = (field: keyof HotelInfo, value: any) => {
    if (!data) return;
    setData({
      ...data,
      hotel: {
        ...data.hotel,
        [field]: value
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Editar Hotel</h3>
              <p className="text-sm text-gray-600">Modifica la información del proveedor y hotel</p>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando datos...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Información del Proveedor */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <User className="h-6 w-6 mr-2 text-blue-600" />
                  Información del Proveedor
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={data.proveedor.nombre}
                      onChange={(e) => updateProveedorField('nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={data.proveedor.email}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="text"
                      value={data.proveedor.telefono}
                      onChange={(e) => updateProveedorField('telefono', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <input
                      type="text"
                      value={data.proveedor.ciudad}
                      onChange={(e) => updateProveedorField('ciudad', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                    <input
                      type="text"
                      value={data.proveedor.pais}
                      onChange={(e) => updateProveedorField('pais', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                    <input
                      type="url"
                      value={data.proveedor.sitio_web}
                      onChange={(e) => updateProveedorField('sitio_web', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={data.proveedor.direccion}
                      onChange={(e) => updateProveedorField('direccion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                    <input
                      type="text"
                      value={data.proveedor.ubicacion}
                      onChange={(e) => updateProveedorField('ubicacion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating Promedio</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={data.proveedor.rating_promedio}
                      onChange={(e) => updateProveedorField('rating_promedio', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Documento</label>
                    <input
                      type="text"
                      value={data.proveedor.tipo_documento}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número Documento</label>
                    <input
                      type="text"
                      value={data.proveedor.numero_documento}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="verificado"
                      checked={data.proveedor.verificado}
                      onChange={(e) => updateProveedorField('verificado', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="verificado" className="ml-2 block text-sm text-gray-900">
                      Verificado
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={data.proveedor.descripcion}
                    onChange={(e) => updateProveedorField('descripcion', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Información del Hotel */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <Building2 className="h-6 w-6 mr-2 text-green-600" />
                  Detalles del Hotel
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estrellas</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={data.hotel.estrellas}
                      onChange={(e) => updateHotelField('estrellas', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Habitaciones</label>
                    <input
                      type="number"
                      min="1"
                      value={data.hotel.numero_habitaciones}
                      onChange={(e) => updateHotelField('numero_habitaciones', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Habitación</label>
                    <input
                      type="text"
                      value={data.hotel.tipo_habitacion}
                      onChange={(e) => updateHotelField('tipo_habitacion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                    <input
                      type="time"
                      value={data.hotel.check_in}
                      onChange={(e) => updateHotelField('check_in', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                    <input
                      type="time"
                      value={data.hotel.check_out}
                      onChange={(e) => updateHotelField('check_out', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio Base</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.hotel.precio_ascendente}
                      onChange={(e) => updateHotelField('precio_ascendente', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Servicios Incluidos</label>
                  <textarea
                    value={data.hotel.servicios_incluidos}
                    onChange={(e) => updateHotelField('servicios_incluidos', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Checkboxes para servicios */}
                <div className="mt-6">
                  <h5 className="text-lg font-medium text-gray-900 mb-4">Servicios y Facilidades</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      { key: 'recepcion_24_horas', label: 'Recepción 24h' },
                      { key: 'piscina', label: 'Piscina' },
                      { key: 'admite_mascotas', label: 'Admite Mascotas' },
                      { key: 'pet_friendly', label: 'Pet Friendly' },
                      { key: 'tiene_estacionamiento', label: 'Estacionamiento' },
                      { key: 'servicio_restaurante', label: 'Restaurante' },
                      { key: 'bar', label: 'Bar' },
                      { key: 'room_service', label: 'Room Service' },
                      { key: 'asensor', label: 'Ascensor' },
                      { key: 'rampa_discapacitado', label: 'Rampa Discapacitados' },
                      { key: 'auditorio', label: 'Auditorio' },
                      { key: 'parqueadero', label: 'Parqueadero' },
                      { key: 'planta_energia', label: 'Planta Energía' },
                    ].map((service) => (
                      <div key={service.key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={service.key}
                          checked={data.hotel[service.key as keyof HotelInfo] as boolean}
                          onChange={(e) => updateHotelField(service.key as keyof HotelInfo, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={service.key} className="ml-2 block text-sm text-gray-900">
                          {service.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !data}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
