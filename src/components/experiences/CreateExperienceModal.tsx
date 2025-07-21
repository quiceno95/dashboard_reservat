import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, PlusCircle } from 'lucide-react';

interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  loading: boolean;
}

// Campos mínimos para no saturar al usuario
const initialForm = {
  proveedor: {
    tipo: 'tour',
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
    relevancia: 'MEDIA',
    usuario_creador: 'admin',
    tipo_documento: 'NIT',
    numero_documento: '',
    activo: true,
  },
  experiencia: {
    duracion: 1,
    dificultad: 'FACIL',
    idioma: 'ES',
    incluye_transporte: false,
    grupo_maximo: 5,
    guia_incluido: true,
    equipamiento_requerido: '',
    punto_de_encuentro: '',
    numero_rnt: '',
  },
};

export const CreateExperienceModal: React.FC<CreateExperienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState<typeof initialForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.proveedor.nombre.trim()) newErrors['proveedor.nombre'] = 'Nombre proveedor requerido';
    if (!formData.proveedor.email.trim()) newErrors['proveedor.email'] = 'Email requerido';
    if (!formData.experiencia.punto_de_encuentro.trim()) newErrors['experiencia.punto_de_encuentro'] = 'Punto de encuentro requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormValue = (path: string, value: any) => {
    setFormData(prev => {
      const copy: any = { ...prev };
      const parts = path.split('.');
      let ref = copy;
      for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
      ref[parts[parts.length - 1]] = value;
      return copy;
    });
    if (errors[path]) setErrors(prev => ({ ...prev, [path]: '' }));
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    path: string,
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    updateFormValue(path, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const inputCls = 'block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  const modalContent = (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PlusCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crear Experiencia</h3>
              <p className="text-sm text-gray-600">Completa la información requerida</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <h4 className="text-md font-semibold text-gray-800">Datos del Proveedor</h4>
          {/* Proveedor nombre */}
          <div>
            <label className={labelCls}>Nombre *</label>
            <input type="text" className={`${inputCls} ${errors['proveedor.nombre'] ? 'border-red-300' : 'border-gray-300'}`} value={formData.proveedor.nombre} onChange={e => handleInput(e, 'proveedor.nombre')} />
            {errors['proveedor.nombre'] && <p className="text-sm text-red-600">{errors['proveedor.nombre']}</p>}
          </div>
          {/* Proveedor email */}
          <div>
            <label className={labelCls}>Email *</label>
            <input type="email" className={`${inputCls} ${errors['proveedor.email'] ? 'border-red-300' : 'border-gray-300'}`} value={formData.proveedor.email} onChange={e => handleInput(e, 'proveedor.email')} />
            {errors['proveedor.email'] && <p className="text-sm text-red-600">{errors['proveedor.email']}</p>}
          </div>
          {/* Descripción */}
          <div>
            <label className={labelCls}>Descripción *</label>
            <textarea rows={2} className={`${inputCls} ${errors['proveedor.descripcion'] ? 'border-red-300' : 'border-gray-300'}`} value={formData.proveedor.descripcion} onChange={e => handleInput(e, 'proveedor.descripcion')} />
            {errors['proveedor.descripcion'] && <p className="text-sm text-red-600">{errors['proveedor.descripcion']}</p>}
          </div>
          {/* Verificado */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="proveedor_verificado"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
              checked={formData.proveedor.verificado}
              onChange={e => handleInput(e as any, 'proveedor.verificado')}
            />
            <label htmlFor="proveedor_verificado" className="text-sm text-gray-700">Proveedor Verificado</label>
          </div>
          {/* Teléfono */}
          <div>
            <label className={labelCls}>Teléfono</label>
            <input type="text" className={inputCls} value={formData.proveedor.telefono} onChange={e => handleInput(e, 'proveedor.telefono')} />
          </div>
          {/* Dirección */}
          <div>
            <label className={labelCls}>Dirección</label>
            <input type="text" className={inputCls} value={formData.proveedor.direccion} onChange={e => handleInput(e, 'proveedor.direccion')} />
          </div>
          {/* Ciudad */}
          <div>
            <label className={labelCls}>Ciudad</label>
            <input type="text" className={inputCls} value={formData.proveedor.ciudad} onChange={e => handleInput(e, 'proveedor.ciudad')} />
          </div>
          {/* País */}
          <div>
            <label className={labelCls}>País</label>
            <input type="text" className={inputCls} value={formData.proveedor.pais} onChange={e => handleInput(e, 'proveedor.pais')} />
          </div>
          {/* Sitio Web */}
          <div>
            <label className={labelCls}>Sitio Web</label>
            <input type="url" className={inputCls} value={formData.proveedor.sitio_web} onChange={e => handleInput(e, 'proveedor.sitio_web')} />
          </div>

          <h4 className="text-md font-semibold text-gray-800 pt-4">Datos de la Experiencia</h4>
          {/* Duración */}
          <div>
            <label className={labelCls}>Duración (horas)</label>
            <input type="number" min={1} className={inputCls} value={formData.experiencia.duracion} onChange={e => handleInput(e, 'experiencia.duracion')} />
          </div>
          {/* Dificultad */}
          <div>
            <label className={labelCls}>Dificultad</label>
            <select className={inputCls} value={formData.experiencia.dificultad} onChange={e => handleInput(e, 'experiencia.dificultad')}>
              <option value="FACIL">FÁCIL</option>
              <option value="MODERADO">MODERADO</option>
              <option value="DIFICIL">DIFÍCIL</option>
            </select>
          </div>
          {/* Idioma */}
          <div>
            <label className={labelCls}>Idioma</label>
            <select className={inputCls} value={formData.experiencia.idioma} onChange={e => handleInput(e, 'experiencia.idioma')}>
              <option value="ES">Español</option>
              <option value="EN">Inglés</option>
            </select>
          </div>
          {/* Incluye Transporte */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="incluye_transporte"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
              checked={formData.experiencia.incluye_transporte}
              onChange={e => handleInput(e as any, 'experiencia.incluye_transporte')}
            />
            <label htmlFor="incluye_transporte" className="text-sm text-gray-700">Incluye Transporte</label>
          </div>
          {/* Grupo máximo */}
          <div>
            <label className={labelCls}>Grupo Máximo</label>
            <input type="number" min={1} className={inputCls} value={formData.experiencia.grupo_maximo} onChange={e => handleInput(e, 'experiencia.grupo_maximo')} />
          </div>
          {/* Guía incluido */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="guia_incluido"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
              checked={formData.experiencia.guia_incluido}
              onChange={e => handleInput(e as any, 'experiencia.guia_incluido')}
            />
            <label htmlFor="guia_incluido" className="text-sm text-gray-700">Guía Incluido</label>
          </div>
          {/* Equipamiento requerido */}
          <div>
            <label className={labelCls}>Equipamiento Requerido</label>
            <textarea rows={3} className={inputCls} value={formData.experiencia.equipamiento_requerido} onChange={e => handleInput(e, 'experiencia.equipamiento_requerido')} />
          </div>
          {/* Punto de encuentro */}
          <div>
            <label className={labelCls}>Punto de Encuentro *</label>
            <input type="text" className={`${inputCls} ${errors['experiencia.punto_de_encuentro'] ? 'border-red-300' : 'border-gray-300'}`} value={formData.experiencia.punto_de_encuentro} onChange={e => handleInput(e, 'experiencia.punto_de_encuentro')} />
            {errors['experiencia.punto_de_encuentro'] && <p className="text-sm text-red-600">{errors['experiencia.punto_de_encuentro']}</p>}
          </div>
          {/* Número RNT */}
          <div>
            <label className={labelCls}>Número RNT</label>
            <input type="text" className={inputCls} value={formData.experiencia.numero_rnt} onChange={e => handleInput(e, 'experiencia.numero_rnt')} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-60">
              <Save className="h-5 w-5" />
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
