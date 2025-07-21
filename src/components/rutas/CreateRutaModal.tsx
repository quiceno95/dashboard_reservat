import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Route, Plus } from 'lucide-react';
import { RutaModalProps } from '../../types/ruta';
import { rutaService } from '../../services/rutaService';
import Swal from 'sweetalert2';

const CreateRutaModal: React.FC<RutaModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion_estimada: 0,
    activo: true,
    puntos_interes: '',
    recomendada: false,
    origen: '',
    destino: '',
    precio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      duracion_estimada: 0,
      activo: true,
      puntos_interes: '',
      recomendada: false,
      origen: '',
      destino: '',
      precio: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    if (!formData.origen.trim()) {
      newErrors.origen = 'El origen es requerido';
    }
    if (!formData.destino.trim()) {
      newErrors.destino = 'El destino es requerido';
    }
    if (!formData.puntos_interes.trim()) {
      newErrors.puntos_interes = 'Los puntos de interés son requeridos';
    }
    if (!formData.precio.trim()) {
      newErrors.precio = 'El precio es requerido';
    }
    if (formData.duracion_estimada <= 0) {
      newErrors.duracion_estimada = 'La duración debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      await rutaService.createRuta(formData);
      
      await Swal.fire({
        title: '¡Creada!',
        text: 'Ruta creada correctamente',
        icon: 'success',
        confirmButtonColor: '#059669',
        timer: 3000,
        timerProgressBar: true
      });

      if (onSave) {
        onSave();
      }
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Error creating ruta:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al crear la ruta',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Route className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Crear Nueva Ruta</h3>
              <p className="text-sm text-gray-500">Agrega una nueva ruta al sistema</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre de la ruta"
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración Estimada (minutos) *
                </label>
                <input
                  type="number"
                  name="duracion_estimada"
                  value={formData.duracion_estimada}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.duracion_estimada ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="120"
                  min="1"
                />
                {errors.duracion_estimada && <p className="text-red-500 text-xs mt-1">{errors.duracion_estimada}</p>}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción detallada de la ruta"
              />
              {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
            </div>

            {/* Origen y Destino */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origen *
                </label>
                <input
                  type="text"
                  name="origen"
                  value={formData.origen}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.origen ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ciudad de origen"
                />
                {errors.origen && <p className="text-red-500 text-xs mt-1">{errors.origen}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destino *
                </label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.destino ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ciudad de destino"
                />
                {errors.destino && <p className="text-red-500 text-xs mt-1">{errors.destino}</p>}
              </div>
            </div>

            {/* Puntos de Interés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntos de Interés *
              </label>
              <textarea
                name="puntos_interes"
                value={formData.puntos_interes}
                onChange={handleInputChange}
                rows={2}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.puntos_interes ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Lugares de interés en la ruta"
              />
              {errors.puntos_interes && <p className="text-red-500 text-xs mt-1">{errors.puntos_interes}</p>}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="text"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.precio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="50000"
              />
              {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Ruta activa
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="recomendada"
                  checked={formData.recomendada}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Ruta recomendada
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Creando...' : 'Crear Ruta'}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateRutaModal;
