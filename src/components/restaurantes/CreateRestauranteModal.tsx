import React, { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { CreateRestauranteData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';
import Swal from 'sweetalert2';

interface CreateRestauranteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRestauranteModal: React.FC<CreateRestauranteModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateRestauranteData>({
    // Datos del proveedor
    tipo: 'restaurante',
    nombre: '',
    descripcion: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Colombia',
    sitio_web: '',
    rating_promedio: 5,
    verificado: false,
    fecha_registro: new Date().toISOString(),
    ubicacion: '',
    redes_sociales: '',
    relevancia: 'media',
    usuario_creador: 'admin',
    tipo_documento: '',
    numero_documento: '',
    activo: true,
    
    // Datos específicos del restaurante
    tipo_cocina: '',
    horario_apertura: '08:00',
    horario_cierre: '22:00',
    capacidad: 50,
    menu_url: '',
    tiene_terraza: false,
    apto_celiacos: false,
    apto_vegetarianos: false,
    reservas_requeridas: false,
    entrega_a_domicilio: false,
    wifi: false,
    zonas_comunes: false,
    auditorio: false,
    pet_friendly: false,
    eventos: false,
    menu_vegana: false,
    bufete: false,
    catering: false,
    menu_infantil: false,
    parqueadero: false,
    terraza: false,
    sillas_bebe: false,
    decoraciones_fechas_especiales: false,
    rampa_discapacitados: false,
    aforo_maximo: 100,
    tipo_comida: '',
    precio_ascendente: 0
  });

  const handleInputChange = (field: keyof CreateRestauranteData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await restauranteService.createRestaurante(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating restaurante:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al crear el restaurante'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Crear Nuevo Restaurante</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                disabled={saving}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del Proveedor */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Información del Proveedor</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nombre del restaurante"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="correo@restaurante.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Calle 123 #45-67"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Bogotá"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        País *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pais}
                        onChange={(e) => handleInputChange('pais', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      value={formData.sitio_web}
                      onChange={(e) => handleInputChange('sitio_web', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://www.restaurante.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo Documento *
                      </label>
                      <select
                        required
                        value={formData.tipo_documento}
                        onChange={(e) => handleInputChange('tipo_documento', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Seleccionar</option>
                        <option value="NIT">NIT</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="RUT">RUT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número Documento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.numero_documento}
                        onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="900123456-7"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating Promedio *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      required
                      value={formData.rating_promedio}
                      onChange={(e) => handleInputChange('rating_promedio', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.verificado}
                        onChange={(e) => handleInputChange('verificado', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Verificado</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.activo}
                        onChange={(e) => handleInputChange('activo', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Activo</span>
                    </label>
                  </div>
                </div>

                {/* Información del Restaurante */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Información del Restaurante</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Cocina *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tipo_cocina}
                      onChange={(e) => handleInputChange('tipo_cocina', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Italiana, Mexicana, Colombiana..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Comida *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tipo_comida}
                      onChange={(e) => handleInputChange('tipo_comida', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Casual, Gourmet, Rápida..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horario Apertura *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.horario_apertura}
                        onChange={(e) => handleInputChange('horario_apertura', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horario Cierre *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.horario_cierre}
                        onChange={(e) => handleInputChange('horario_cierre', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacidad *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.capacidad}
                        onChange={(e) => handleInputChange('capacidad', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aforo Máximo *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.aforo_maximo}
                        onChange={(e) => handleInputChange('aforo_maximo', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Menú
                    </label>
                    <input
                      type="url"
                      value={formData.menu_url}
                      onChange={(e) => handleInputChange('menu_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://www.restaurante.com/menu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Ascendente *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.precio_ascendente}
                      onChange={(e) => handleInputChange('precio_ascendente', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Precio promedio en pesos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ubicacion}
                      onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Centro, Zona Rosa, Norte..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Redes Sociales
                    </label>
                    <input
                      type="text"
                      value={formData.redes_sociales}
                      onChange={(e) => handleInputChange('redes_sociales', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="@restaurante"
                    />
                  </div>
                </div>
              </div>

              {/* Servicios y Características */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Servicios y Características</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'wifi', label: 'WiFi' },
                    { key: 'parqueadero', label: 'Parqueadero' },
                    { key: 'pet_friendly', label: 'Pet Friendly' },
                    { key: 'entrega_a_domicilio', label: 'Entrega a Domicilio' },
                    { key: 'terraza', label: 'Terraza' },
                    { key: 'eventos', label: 'Eventos' },
                    { key: 'catering', label: 'Catering' },
                    { key: 'bufete', label: 'Bufete' },
                    { key: 'zonas_comunes', label: 'Zonas Comunes' },
                    { key: 'auditorio', label: 'Auditorio' },
                    { key: 'sillas_bebe', label: 'Sillas de Bebé' },
                    { key: 'rampa_discapacitados', label: 'Rampa Discapacitados' },
                    { key: 'apto_celiacos', label: 'Apto Celíacos' },
                    { key: 'apto_vegetarianos', label: 'Apto Vegetarianos' },
                    { key: 'menu_vegana', label: 'Menú Vegano' },
                    { key: 'menu_infantil', label: 'Menú Infantil' },
                    { key: 'reservas_requeridas', label: 'Reservas Requeridas' },
                    { key: 'decoraciones_fechas_especiales', label: 'Decoraciones Fechas Especiales' }
                  ].map((service) => (
                    <label key={service.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData as any)[service.key]}
                        onChange={(e) => handleInputChange(service.key as keyof CreateRestauranteData, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe el restaurante, su ambiente, especialidades..."
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Restaurante
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRestauranteModal;
