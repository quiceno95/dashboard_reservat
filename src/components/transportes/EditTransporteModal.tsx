import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Car, Save } from 'lucide-react';
import { TransporteModalProps } from '../../types/transporte';
import { transporteService } from '../../services/transporteService';
import Swal from 'sweetalert2';

const EditTransporteModal: React.FC<TransporteModalProps> = ({ isOpen, onClose, transporte, onSave }) => {
  const [formData, setFormData] = useState({
    // Datos del proveedor
    proveedor: {
      tipo: '',
      nombre: '',
      descripcion: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
      sitio_web: '',
      rating_promedio: 0,
      verificado: false,
      fecha_registro: '',
      ubicacion: '',
      redes_sociales: '',
      relevancia: '',
      usuario_creador: '',
      tipo_documento: '',
      numero_documento: '',
      activo: true
    },
    // Datos del transporte
    transporte: {
      tipo_vehiculo: '',
      modelo: '',
      anio: new Date().getFullYear(),
      placa: '',
      capacidad: 0,
      aire_acondicionado: false,
      wifi: false,
      disponible: true,
      combustible: '',
      seguro_vigente: false,
      fecha_mantenimiento: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transporte) {
      setFormData({
        proveedor: {
          tipo: transporte.proveedor.tipo,
          nombre: transporte.proveedor.nombre,
          descripcion: transporte.proveedor.descripcion,
          email: transporte.proveedor.email,
          telefono: transporte.proveedor.telefono,
          direccion: transporte.proveedor.direccion,
          ciudad: transporte.proveedor.ciudad,
          pais: transporte.proveedor.pais,
          sitio_web: transporte.proveedor.sitio_web,
          rating_promedio: transporte.proveedor.rating_promedio,
          verificado: transporte.proveedor.verificado,
          fecha_registro: transporte.proveedor.fecha_registro,
          ubicacion: transporte.proveedor.ubicacion,
          redes_sociales: transporte.proveedor.redes_sociales,
          relevancia: transporte.proveedor.relevancia,
          usuario_creador: transporte.proveedor.usuario_creador,
          tipo_documento: transporte.proveedor.tipo_documento,
          numero_documento: transporte.proveedor.numero_documento,
          activo: transporte.proveedor.activo
        },
        transporte: {
          tipo_vehiculo: transporte.transporte.tipo_vehiculo,
          modelo: transporte.transporte.modelo,
          anio: transporte.transporte.anio,
          placa: transporte.transporte.placa,
          capacidad: transporte.transporte.capacidad,
          aire_acondicionado: transporte.transporte.aire_acondicionado,
          wifi: transporte.transporte.wifi,
          disponible: transporte.transporte.disponible,
          combustible: transporte.transporte.combustible,
          seguro_vigente: transporte.transporte.seguro_vigente,
          fecha_mantenimiento: transporte.transporte.fecha_mantenimiento.split('T')[0]
        }
      });
    }
  }, [transporte]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validaciones del proveedor
    if (!formData.proveedor.nombre.trim()) newErrors['proveedor.nombre'] = 'El nombre es requerido';
    if (!formData.proveedor.email.trim()) newErrors['proveedor.email'] = 'El email es requerido';
    if (!formData.proveedor.telefono.trim()) newErrors['proveedor.telefono'] = 'El teléfono es requerido';
    if (!formData.proveedor.ciudad.trim()) newErrors['proveedor.ciudad'] = 'La ciudad es requerida';
    if (!formData.proveedor.pais.trim()) newErrors['proveedor.pais'] = 'El país es requerido';

    // Validaciones del transporte
    if (!formData.transporte.tipo_vehiculo.trim()) newErrors['transporte.tipo_vehiculo'] = 'El tipo de vehículo es requerido';
    if (!formData.transporte.modelo.trim()) newErrors['transporte.modelo'] = 'El modelo es requerido';
    if (!formData.transporte.placa.trim()) newErrors['transporte.placa'] = 'La placa es requerida';
    if (formData.transporte.capacidad <= 0) newErrors['transporte.capacidad'] = 'La capacidad debe ser mayor a 0';
    if (!formData.transporte.combustible.trim()) newErrors['transporte.combustible'] = 'El tipo de combustible es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !transporte) return;

    try {
      setLoading(true);
      
      const updateData = {
        proveedor: {
          ...formData.proveedor,
          fecha_registro: new Date(formData.proveedor.fecha_registro).toISOString()
        },
        transporte: {
          ...formData.transporte,
          fecha_mantenimiento: new Date(formData.transporte.fecha_mantenimiento).toISOString()
        }
      };

      await transporteService.updateTransporte(transporte.transporte.id_transporte, updateData);
      
      await Swal.fire({
        title: '¡Actualizado!',
        text: 'Transporte actualizado correctamente',
        icon: 'success',
        confirmButtonColor: '#059669',
        timer: 3000,
        timerProgressBar: true
      });

      if (onSave) {
        onSave();
      }
      onClose();
      
    } catch (error) {
      console.error('Error updating transporte:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al actualizar el transporte',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: 'proveedor' | 'transporte', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Limpiar error del campo
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  if (!isOpen || !transporte) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Editar Transporte</h3>
              <p className="text-sm text-gray-500">Actualiza la información del transporte</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {/* Información del Proveedor */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Información del Proveedor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.proveedor.nombre}
                    onChange={(e) => handleInputChange('proveedor', 'nombre', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['proveedor.nombre'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['proveedor.nombre'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.nombre']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.proveedor.email}
                    onChange={(e) => handleInputChange('proveedor', 'email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['proveedor.email'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['proveedor.email'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.email']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={formData.proveedor.telefono}
                    onChange={(e) => handleInputChange('proveedor', 'telefono', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['proveedor.telefono'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['proveedor.telefono'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.telefono']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input
                    type="text"
                    value={formData.proveedor.ciudad}
                    onChange={(e) => handleInputChange('proveedor', 'ciudad', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['proveedor.ciudad'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['proveedor.ciudad'] && <p className="text-red-500 text-xs mt-1">{errors['proveedor.ciudad']}</p>}
                </div>
              </div>
            </div>

            {/* Información del Transporte */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Información del Vehículo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo *</label>
                  <select
                    value={formData.transporte.tipo_vehiculo}
                    onChange={(e) => handleInputChange('transporte', 'tipo_vehiculo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['transporte.tipo_vehiculo'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Bus">Bus</option>
                    <option value="Van">Van</option>
                    <option value="Automóvil">Automóvil</option>
                    <option value="Camioneta">Camioneta</option>
                    <option value="Microbus">Microbus</option>
                  </select>
                  {errors['transporte.tipo_vehiculo'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.tipo_vehiculo']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                  <input
                    type="text"
                    value={formData.transporte.modelo}
                    onChange={(e) => handleInputChange('transporte', 'modelo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['transporte.modelo'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['transporte.modelo'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.modelo']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                  <input
                    type="text"
                    value={formData.transporte.placa}
                    onChange={(e) => handleInputChange('transporte', 'placa', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['transporte.placa'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['transporte.placa'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.placa']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
                  <input
                    type="number"
                    value={formData.transporte.capacidad}
                    onChange={(e) => handleInputChange('transporte', 'capacidad', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['transporte.capacidad'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  {errors['transporte.capacidad'] && <p className="text-red-500 text-xs mt-1">{errors['transporte.capacidad']}</p>}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transporte.aire_acondicionado}
                    onChange={(e) => handleInputChange('transporte', 'aire_acondicionado', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Aire Acondicionado</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transporte.wifi}
                    onChange={(e) => handleInputChange('transporte', 'wifi', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">WiFi</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.transporte.disponible}
                    onChange={(e) => handleInputChange('transporte', 'disponible', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Disponible</label>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditTransporteModal;
