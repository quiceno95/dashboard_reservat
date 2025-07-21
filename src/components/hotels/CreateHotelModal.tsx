import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, PlusCircle } from 'lucide-react';

interface CreateHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  loading: boolean;
}

// Formulario inicial con valores por defecto
const initialForm = {
  proveedor: {
    tipo: 'hotel',
    nombre: '',
    descripcion: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    sitio_web: '',
    rating_promedio: 4,
    verificado: false,
    fecha_registro: new Date().toISOString(),
    ubicacion: '',
    redes_sociales: '',
    relevancia: 'Alto',
    usuario_creador: 'admin',
    tipo_documento: 'NIT',
    numero_documento: '',
    activo: true,
  },
  hotel: {
    estrellas: 3,
    numero_habitaciones: 20,
    servicios_incluidos: '',
    check_in: '14:00',
    check_out: '12:00',
    admite_mascotas: false,
    tiene_estacionamiento: false,
    tipo_habitacion: 'Standard',
    precio_ascendente: 50.0,
    servicio_restaurante: false,
    recepcion_24_horas: false,
    bar: false,
    room_service: false,
    asensor: false,
    rampa_discapacitado: false,
    pet_friendly: false,
    auditorio: false,
    parqueadero: false,
    piscina: false,
    planta_energia: false,
  },
};

export const CreateHotelModal: React.FC<CreateHotelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading,
}) => {
  const [form, setForm] = useState(initialForm);

  const updateProveedorField = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      proveedor: {
        ...prev.proveedor,
        [field]: value
      }
    }));
  };

  const updateHotelField = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      hotel: {
        ...prev.hotel,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!form.proveedor.nombre.trim()) {
      alert('El nombre del proveedor es requerido');
      return;
    }
    if (!form.proveedor.email.trim()) {
      alert('El email del proveedor es requerido');
      return;
    }
    if (!form.proveedor.telefono.trim()) {
      alert('El teléfono del proveedor es requerido');
      return;
    }
    if (!form.proveedor.ciudad.trim()) {
      alert('La ciudad es requerida');
      return;
    }
    if (!form.proveedor.pais.trim()) {
      alert('El país es requerido');
      return;
    }

    // Formatear datos para envío
    const payload = {
      proveedor: {
        ...form.proveedor,
        fecha_registro: new Date().toISOString(),
      },
      hotel: {
        ...form.hotel,
        check_in: form.hotel.check_in + ':00',
        check_out: form.hotel.check_out + ':00',
      }
    };

    onSave(payload);
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PlusCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Hotel</h3>
              <p className="text-sm text-gray-600">Completa la información del proveedor y hotel</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Información del Proveedor */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">
                📋 Información del Proveedor
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Hotel *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.proveedor.nombre}
                    onChange={(e) => updateProveedorField('nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Hotel Paradise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.proveedor.email}
                    onChange={(e) => updateProveedorField('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="hotel@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.proveedor.telefono}
                    onChange={(e) => updateProveedorField('telefono', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.proveedor.ciudad}
                    onChange={(e) => updateProveedorField('ciudad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bogotá"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.proveedor.pais}
                    onChange={(e) => updateProveedorField('pais', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Colombia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={form.proveedor.sitio_web}
                    onChange={(e) => updateProveedorField('sitio_web', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://hotel.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={form.proveedor.direccion}
                    onChange={(e) => updateProveedorField('direccion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Calle Principal 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={form.proveedor.ubicacion}
                    onChange={(e) => updateProveedorField('ubicacion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Centro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating Promedio
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={form.proveedor.rating_promedio}
                    onChange={(e) => updateProveedorField('rating_promedio', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo Documento
                  </label>
                  <select
                    value={form.proveedor.tipo_documento}
                    onChange={(e) => updateProveedorField('tipo_documento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="NIT">NIT</option>
                    <option value="CC">Cédula</option>
                    <option value="CE">Cédula Extranjería</option>
                    <option value="RUT">RUT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número Documento
                  </label>
                  <input
                    type="text"
                    value={form.proveedor.numero_documento}
                    onChange={(e) => updateProveedorField('numero_documento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verificado"
                    checked={form.proveedor.verificado}
                    onChange={(e) => updateProveedorField('verificado', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="verificado" className="ml-2 block text-sm text-gray-900">
                    Verificado
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={form.proveedor.descripcion}
                  onChange={(e) => updateProveedorField('descripcion', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción del hotel..."
                />
              </div>
            </div>

            {/* Información del Hotel */}
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">
                🏨 Detalles del Hotel
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estrellas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.hotel.estrellas}
                    onChange={(e) => updateHotelField('estrellas', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Habitaciones
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.hotel.numero_habitaciones}
                    onChange={(e) => updateHotelField('numero_habitaciones', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Habitación
                  </label>
                  <select
                    value={form.hotel.tipo_habitacion}
                    onChange={(e) => updateHotelField('tipo_habitacion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Superior">Superior</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="time"
                    value={form.hotel.check_in}
                    onChange={(e) => updateHotelField('check_in', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="time"
                    value={form.hotel.check_out}
                    onChange={(e) => updateHotelField('check_out', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Base
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.hotel.precio_ascendente}
                    onChange={(e) => updateHotelField('precio_ascendente', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicios Incluidos
                </label>
                <textarea
                  value={form.hotel.servicios_incluidos}
                  onChange={(e) => updateHotelField('servicios_incluidos', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Desayuno, WiFi, Parking, etc..."
                />
              </div>

              {/* Servicios y Facilidades */}
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
                        checked={form.hotel[service.key as keyof typeof form.hotel] as boolean}
                        onChange={(e) => updateHotelField(service.key, e.target.checked)}
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

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Hotel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
