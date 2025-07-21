import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, Users, DollarSign, User, Route, Truck } from 'lucide-react';
import { CreateViajeModalProps, DatosViaje, ESTADOS_VIAJE } from '../../types/viaje';

const CreateViajeModal: React.FC<CreateViajeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<DatosViaje>({
    ruta_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    capacidad_total: 0,
    capacidad_disponible: 0,
    precio: 0,
    guia_asignado: '',
    estado: ESTADOS_VIAJE.PROGRAMADO,
    id_transportador: '',
    activo: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-ajustar capacidad disponible cuando cambia la total
    if (name === 'capacidad_total') {
      const newTotal = Number(value);
      setFormData(prev => ({
        ...prev,
        capacidad_total: newTotal,
        capacidad_disponible: newTotal // Por defecto, toda la capacidad está disponible
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ruta_id.trim()) {
      newErrors.ruta_id = 'El ID de la ruta es requerido';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida';
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);
      if (fin <= inicio) {
        newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (!formData.capacidad_total || formData.capacidad_total <= 0) {
      newErrors.capacidad_total = 'La capacidad total debe ser mayor a 0';
    }

    if (formData.capacidad_disponible < 0) {
      newErrors.capacidad_disponible = 'La capacidad disponible no puede ser negativa';
    }

    if (formData.capacidad_disponible > formData.capacidad_total) {
      newErrors.capacidad_disponible = 'La capacidad disponible no puede ser mayor a la capacidad total';
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.guia_asignado.trim()) {
      newErrors.guia_asignado = 'El guía asignado es requerido';
    }

    if (!formData.estado) {
      newErrors.estado = 'El estado es requerido';
    }

    if (!formData.id_transportador.trim()) {
      newErrors.id_transportador = 'El ID del transportador es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error al crear viaje:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      ruta_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      capacidad_total: 0,
      capacidad_disponible: 0,
      precio: 0,
      guia_asignado: '',
      estado: ESTADOS_VIAJE.PROGRAMADO,
      id_transportador: '',
      activo: true
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Viaje</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Fechas */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Fechas del Viaje
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="datetime-local"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fecha_inicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_inicio && (
                  <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin *
                </label>
                <input
                  type="datetime-local"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fecha_fin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_fin && (
                  <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>
                )}
              </div>
            </div>
          </div>

          {/* Capacidad y Precio */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Capacidad y Precio
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad Total *
                </label>
                <input
                  type="number"
                  name="capacidad_total"
                  value={formData.capacidad_total}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.capacidad_total ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.capacidad_total && (
                  <p className="text-red-500 text-xs mt-1">{errors.capacidad_total}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad Disponible *
                </label>
                <input
                  type="number"
                  name="capacidad_disponible"
                  value={formData.capacidad_disponible}
                  onChange={handleInputChange}
                  min="0"
                  max={formData.capacidad_total}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.capacidad_disponible ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.capacidad_disponible && (
                  <p className="text-red-500 text-xs mt-1">{errors.capacidad_disponible}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (COP) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.precio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.precio && (
                  <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guía y Estado */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Asignaciones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guía Asignado *
                </label>
                <input
                  type="text"
                  name="guia_asignado"
                  value={formData.guia_asignado}
                  onChange={handleInputChange}
                  placeholder="Nombre del guía"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.guia_asignado ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.guia_asignado && (
                  <p className="text-red-500 text-xs mt-1">{errors.guia_asignado}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.estado ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value={ESTADOS_VIAJE.PROGRAMADO}>Programado</option>
                  <option value={ESTADOS_VIAJE.EN_CURSO}>En Curso</option>
                  <option value={ESTADOS_VIAJE.FINALIZADO}>Finalizado</option>
                  <option value={ESTADOS_VIAJE.CANCELADO}>Cancelado</option>
                </select>
                {errors.estado && (
                  <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
                )}
              </div>
            </div>
          </div>

          {/* IDs Técnicos */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              IDs Técnicos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de Ruta *
                </label>
                <div className="relative">
                  <Route className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="ruta_id"
                    value={formData.ruta_id}
                    onChange={handleInputChange}
                    placeholder="UUID de la ruta"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ruta_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.ruta_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.ruta_id}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de Transportador *
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="id_transportador"
                    value={formData.id_transportador}
                    onChange={handleInputChange}
                    placeholder="UUID del transportador"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.id_transportador ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.id_transportador && (
                  <p className="text-red-500 text-xs mt-1">{errors.id_transportador}</p>
                )}
              </div>
            </div>
          </div>

          {/* Estado Activo */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Viaje activo
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Viaje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateViajeModal;
