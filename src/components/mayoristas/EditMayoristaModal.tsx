import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, User, Phone, DollarSign } from 'lucide-react';
import { CreateMayoristaData } from '../../types/mayorista';
import { mayoristaService } from '../../services/mayoristaService';
import Swal from 'sweetalert2';

interface EditMayoristaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mayoristaId: string | null;
  onMayoristaUpdated: () => void;
}

const EditMayoristaModal: React.FC<EditMayoristaModalProps> = ({
  isOpen,
  onClose,
  mayoristaId,
  onMayoristaUpdated,
}) => {
  const [formData, setFormData] = useState<CreateMayoristaData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    tipo_documento: 'NIT',
    numero_documento: '',
    contacto_principal: '',
    telefono_contacto: '',
    email_contacto: '',
    comision_porcentaje: 0,
    limite_credito: 0,
    estado: 'activo',
    verificado: false,
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateMayoristaData>>({});

  useEffect(() => {
    if (isOpen && mayoristaId) {
      fetchMayoristaData();
    }
  }, [isOpen, mayoristaId]);

  const fetchMayoristaData = async () => {
    if (!mayoristaId) return;
    
    setLoadingData(true);
    try {
      const mayorista = await mayoristaService.getMayoristaById(mayoristaId);
      setFormData({
        nombre: mayorista.nombre,
        email: mayorista.email,
        telefono: mayorista.telefono,
        direccion: mayorista.direccion,
        ciudad: mayorista.ciudad,
        pais: mayorista.pais,
        tipo_documento: mayorista.tipo_documento,
        numero_documento: mayorista.numero_documento,
        contacto_principal: mayorista.contacto_principal,
        telefono_contacto: mayorista.telefono_contacto,
        email_contacto: mayorista.email_contacto,
        comision_porcentaje: mayorista.comision_porcentaje,
        limite_credito: mayorista.limite_credito,
        estado: mayorista.estado,
        verificado: mayorista.verificado,
        observaciones: mayorista.observaciones || ''
      });
    } catch (error) {
      console.error('Error fetching mayorista data:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al cargar los datos del mayorista',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#EF4444'
      });
      onClose();
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateMayoristaData> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!formData.pais.trim()) newErrors.pais = 'El país es requerido';
    if (!formData.numero_documento.trim()) newErrors.numero_documento = 'El número de documento es requerido';
    if (!formData.contacto_principal.trim()) newErrors.contacto_principal = 'El contacto principal es requerido';
    if (!formData.telefono_contacto.trim()) newErrors.telefono_contacto = 'El teléfono de contacto es requerido';
    if (!formData.email_contacto.trim()) newErrors.email_contacto = 'El email de contacto es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email_contacto)) newErrors.email_contacto = 'Email de contacto inválido';
    if (formData.comision_porcentaje < 0 || formData.comision_porcentaje > 100) newErrors.comision_porcentaje = 'La comisión debe estar entre 0 y 100';
    if (formData.limite_credito < 0) newErrors.limite_credito = 'El límite de crédito no puede ser negativo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !mayoristaId) return;

    setLoading(true);
    try {
      await mayoristaService.updateMayorista(mayoristaId, formData);
      
      await Swal.fire({
        title: '¡Éxito!',
        text: 'Mayorista actualizado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3B82F6'
      });

      onMayoristaUpdated();
      handleClose();
    } catch (error) {
      console.error('Error updating mayorista:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al actualizar el mayorista. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
      tipo_documento: 'NIT',
      numero_documento: '',
      contacto_principal: '',
      telefono_contacto: '',
      email_contacto: '',
      comision_porcentaje: 0,
      limite_credito: 0,
      estado: 'activo',
      verificado: false,
      observaciones: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CreateMayoristaData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-yellow-50">
          <div className="flex items-center">
            <User className="w-8 h-8 text-yellow-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Editar Mayorista</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loadingData ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Información Básica */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Información Básica
                  </h3>
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.nombre ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nombre del mayorista"
                      />
                      {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="email@ejemplo.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.telefono ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+57 300 123 4567"
                      />
                      {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Documento *
                      </label>
                      <select
                        name="tipo_documento"
                        value={formData.tipo_documento}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="NIT">NIT</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="RUT">RUT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        name="numero_documento"
                        value={formData.numero_documento}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.numero_documento ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123456789"
                      />
                      {errors.numero_documento && <p className="text-red-500 text-xs mt-1">{errors.numero_documento}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.direccion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Calle 123 #45-67"
                      />
                      {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.ciudad ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Bogotá"
                      />
                      {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        País *
                      </label>
                      <input
                        type="text"
                        name="pais"
                        value={formData.pais}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.pais ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Colombia"
                      />
                      {errors.pais && <p className="text-red-500 text-xs mt-1">{errors.pais}</p>}
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    Contacto Principal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Contacto *
                      </label>
                      <input
                        type="text"
                        name="contacto_principal"
                        value={formData.contacto_principal}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.contacto_principal ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Juan Pérez"
                      />
                      {errors.contacto_principal && <p className="text-red-500 text-xs mt-1">{errors.contacto_principal}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="text"
                        name="telefono_contacto"
                        value={formData.telefono_contacto}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.telefono_contacto ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+57 300 123 4567"
                      />
                      {errors.telefono_contacto && <p className="text-red-500 text-xs mt-1">{errors.telefono_contacto}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de Contacto *
                      </label>
                      <input
                        type="email"
                        name="email_contacto"
                        value={formData.email_contacto}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email_contacto ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="contacto@ejemplo.com"
                      />
                      {errors.email_contacto && <p className="text-red-500 text-xs mt-1">{errors.email_contacto}</p>}
                    </div>
                  </div>
                </div>

                {/* Información Comercial */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                    Información Comercial
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comisión (%) *
                      </label>
                      <input
                        type="number"
                        name="comision_porcentaje"
                        value={formData.comision_porcentaje}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.comision_porcentaje ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10.5"
                      />
                      {errors.comision_porcentaje && <p className="text-red-500 text-xs mt-1">{errors.comision_porcentaje}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Límite de Crédito (COP) *
                      </label>
                      <input
                        type="number"
                        name="limite_credito"
                        value={formData.limite_credito}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.limite_credito ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1000000"
                      />
                      {errors.limite_credito && <p className="text-red-500 text-xs mt-1">{errors.limite_credito}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="suspendido">Suspendido</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="verificado"
                        checked={formData.verificado}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Mayorista Verificado
                      </label>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Mayorista'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditMayoristaModal;
