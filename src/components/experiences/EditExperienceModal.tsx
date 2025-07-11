import React, { useState, useEffect } from 'react';
import { X, Save, User, Star, MapPin, Clock, Users, Globe, Shield, Mail, Phone, ExternalLink, Calendar } from 'lucide-react';

interface ExperienceEditData {
  proveedor: {
    tipo: string;
    nombre: string;
    descripcion: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    pais: string;
    sitio_web: string;
    rating_promedio: number;
    verificado: boolean;
    fecha_registro: string;
    ubicacion: string;
    redes_sociales: string;
    relevancia: string;
    usuario_creador: string;
    tipo_documento: string;
    numero_documento: string;
    activo: boolean;
  };
  experiencia: {
    duracion: number;
    dificultad: string;
    idioma: string;
    incluye_transporte: boolean;
    grupo_maximo: number;
    guia_incluido: boolean;
    equipamiento_requerido: string;
    punto_de_encuentro: string;
    numero_rnt: string;
  };
}

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceData: any | null;
  onSave: (data: ExperienceEditData) => void;
  loading: boolean;
  saveLoading: boolean;
}

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  isOpen,
  onClose,
  experienceData,
  onSave,
  loading,
  saveLoading
}) => {
  const [formData, setFormData] = useState<ExperienceEditData>({
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
      activo: true,
    },
    experiencia: {
      duracion: 0,
      dificultad: '',
      idioma: '',
      incluye_transporte: false,
      grupo_maximo: 0,
      guia_incluido: false,
      equipamiento_requerido: '',
      punto_de_encuentro: '',
      numero_rnt: '',
    }
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (experienceData) {
      setFormData({
        proveedor: {
          tipo: experienceData.proveedor?.tipo || '',
          nombre: experienceData.proveedor?.nombre || '',
          descripcion: experienceData.proveedor?.descripcion || '',
          email: experienceData.proveedor?.email || '',
          telefono: experienceData.proveedor?.telefono || '',
          direccion: experienceData.proveedor?.direccion || '',
          ciudad: experienceData.proveedor?.ciudad || '',
          pais: experienceData.proveedor?.pais || '',
          sitio_web: experienceData.proveedor?.sitio_web || '',
          rating_promedio: experienceData.proveedor?.rating_promedio || 0,
          verificado: experienceData.proveedor?.verificado || false,
          fecha_registro: experienceData.proveedor?.fecha_registro || '',
          ubicacion: experienceData.proveedor?.ubicacion || '',
          redes_sociales: experienceData.proveedor?.redes_sociales || '',
          relevancia: experienceData.proveedor?.relevancia || '',
          usuario_creador: experienceData.proveedor?.usuario_creador || '',
          tipo_documento: experienceData.proveedor?.tipo_documento || '',
          numero_documento: experienceData.proveedor?.numero_documento || '',
          activo: experienceData.proveedor?.activo ?? true,
        },
        experiencia: {
          duracion: experienceData.experiencia?.duracion || 0,
          dificultad: experienceData.experiencia?.dificultad || '',
          idioma: experienceData.experiencia?.idioma || '',
          incluye_transporte: experienceData.experiencia?.incluye_transporte || false,
          grupo_maximo: experienceData.experiencia?.grupo_maximo || 0,
          guia_incluido: experienceData.experiencia?.guia_incluido || false,
          equipamiento_requerido: experienceData.experiencia?.equipamiento_requerido || '',
          punto_de_encuentro: experienceData.experiencia?.punto_de_encuentro || '',
          numero_rnt: experienceData.experiencia?.numero_rnt || '',
        }
      });
    }
  }, [experienceData]);

  const handleInputChange = (section: 'proveedor' | 'experiencia', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validaciones del proveedor
    if (!formData.proveedor.nombre.trim()) {
      newErrors['proveedor.nombre'] = 'El nombre es requerido';
    }

    if (!formData.proveedor.telefono.trim()) {
      newErrors['proveedor.telefono'] = 'El teléfono es requerido';
    }

    if (!formData.proveedor.direccion.trim()) {
      newErrors['proveedor.direccion'] = 'La dirección es requerida';
    }

    if (!formData.proveedor.ciudad.trim()) {
      newErrors['proveedor.ciudad'] = 'La ciudad es requerida';
    }

    if (!formData.proveedor.pais.trim()) {
      newErrors['proveedor.pais'] = 'El país es requerido';
    }

    // Validaciones de la experiencia
    if (formData.experiencia.duracion <= 0) {
      newErrors['experiencia.duracion'] = 'La duración debe ser mayor a 0';
    }

    if (!formData.experiencia.dificultad) {
      newErrors['experiencia.dificultad'] = 'La dificultad es requerida';
    }

    if (!formData.experiencia.idioma.trim()) {
      newErrors['experiencia.idioma'] = 'El idioma es requerido';
    }

    if (formData.experiencia.grupo_maximo <= 0) {
      newErrors['experiencia.grupo_maximo'] = 'El grupo máximo debe ser mayor a 0';
    }

    if (!formData.experiencia.punto_de_encuentro.trim()) {
      newErrors['experiencia.punto_de_encuentro'] = 'El punto de encuentro es requerido';
    }

    if (!formData.experiencia.numero_rnt.trim()) {
      newErrors['experiencia.numero_rnt'] = 'El número RNT es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
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
        activo: true,
      },
      experiencia: {
        duracion: 0,
        dificultad: '',
        idioma: '',
        incluye_transporte: false,
        grupo_maximo: 0,
        guia_incluido: false,
        equipamiento_requerido: '',
        punto_de_encuentro: '',
        numero_rnt: '',
      }
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Experiencia
              </h3>
              <p className="text-sm text-gray-600">
                Modifica la información del proveedor y experiencia
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos para edición...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Información del Proveedor */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Información del Proveedor
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo - DESACTIVADO */}
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <input
                    type="text"
                    id="tipo"
                    value={formData.proveedor.tipo}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Tipo de proveedor"
                  />
                  <p className="mt-1 text-xs text-gray-500">Este campo no se puede modificar</p>
                </div>

                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.proveedor.nombre}
                    onChange={(e) => handleInputChange('proveedor', 'nombre', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['proveedor.nombre'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del proveedor"
                  />
                  {errors['proveedor.nombre'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['proveedor.nombre']}</p>
                  )}
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    value={formData.proveedor.descripcion}
                    onChange={(e) => handleInputChange('proveedor', 'descripcion', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción del proveedor"
                  />
                </div>

                {/* Email - DESACTIVADO */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.proveedor.email}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Email del proveedor"
                  />
                  <p className="mt-1 text-xs text-gray-500">Este campo no se puede modificar</p>
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={formData.proveedor.telefono}
                    onChange={(e) => handleInputChange('proveedor', 'telefono', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['proveedor.telefono'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Teléfono del proveedor"
                  />
                  {errors['proveedor.telefono'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['proveedor.telefono']}</p>
                  )}
                </div>

                {/* Dirección */}
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Dirección *
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    value={formData.proveedor.direccion}
                    onChange={(e) => handleInputChange('proveedor', 'direccion', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['proveedor.direccion'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dirección del proveedor"
                  />
                  {errors['proveedor.direccion'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['proveedor.direccion']}</p>
                  )}
                </div>

                {/* Ciudad */}
                <div>
                  <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    id="ciudad"
                    value={formData.proveedor.ciudad}
                    onChange={(e) => handleInputChange('proveedor', 'ciudad', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['proveedor.ciudad'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ciudad del proveedor"
                  />
                  {errors['proveedor.ciudad'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['proveedor.ciudad']}</p>
                  )}
                </div>

                {/* País */}
                <div>
                  <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    País *
                  </label>
                  <input
                    type="text"
                    id="pais"
                    value={formData.proveedor.pais}
                    onChange={(e) => handleInputChange('proveedor', 'pais', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['proveedor.pais'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="País del proveedor"
                  />
                  {errors['proveedor.pais'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['proveedor.pais']}</p>
                  )}
                </div>

                {/* Sitio Web */}
                <div>
                  <label htmlFor="sitio_web" className="block text-sm font-medium text-gray-700 mb-2">
                    <ExternalLink className="h-4 w-4 inline mr-1" />
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    id="sitio_web"
                    value={formData.proveedor.sitio_web}
                    onChange={(e) => handleInputChange('proveedor', 'sitio_web', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://ejemplo.com"
                  />
                </div>

                {/* Rating Promedio */}
                <div>
                  <label htmlFor="rating_promedio" className="block text-sm font-medium text-gray-700 mb-2">
                    <Star className="h-4 w-4 inline mr-1" />
                    Rating Promedio
                  </label>
                  <input
                    type="number"
                    id="rating_promedio"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.proveedor.rating_promedio}
                    onChange={(e) => handleInputChange('proveedor', 'rating_promedio', parseFloat(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Tipo de Documento - DESACTIVADO */}
                <div>
                  <label htmlFor="tipo_documento" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <input
                    type="text"
                    id="tipo_documento"
                    value={formData.proveedor.tipo_documento}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Tipo de documento"
                  />
                  <p className="mt-1 text-xs text-gray-500">Este campo no se puede modificar</p>
                </div>

                {/* Número de Documento - DESACTIVADO */}
                <div>
                  <label htmlFor="numero_documento" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    id="numero_documento"
                    value={formData.proveedor.numero_documento}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Número de documento"
                  />
                  <p className="mt-1 text-xs text-gray-500">Este campo no se puede modificar</p>
                </div>

                {/* Verificado */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verificado"
                    checked={formData.proveedor.verificado}
                    onChange={(e) => handleInputChange('proveedor', 'verificado', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="verificado" className="ml-2 block text-sm text-gray-900">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Verificado
                  </label>
                </div>

                {/* Activo - DESACTIVADO */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.proveedor.activo}
                    disabled
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                  />
                  <label htmlFor="activo" className="ml-2 block text-sm text-gray-500">
                    Activo
                  </label>
                  <p className="ml-2 text-xs text-gray-500">(No se puede modificar)</p>
                </div>
              </div>
            </div>

            {/* Detalles de la Experiencia */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Detalles de la Experiencia
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duración */}
                <div>
                  <label htmlFor="duracion" className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Duración (horas) *
                  </label>
                  <input
                    type="number"
                    id="duracion"
                    min="0"
                    value={formData.experiencia.duracion}
                    onChange={(e) => handleInputChange('experiencia', 'duracion', parseInt(e.target.value))}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['experiencia.duracion'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Duración en horas"
                  />
                  {errors['experiencia.duracion'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['experiencia.duracion']}</p>
                  )}
                </div>

                {/* Dificultad */}
                <div>
                  <label htmlFor="dificultad" className="block text-sm font-medium text-gray-700 mb-2">
                    Dificultad *
                  </label>
                  <select
                    id="dificultad"
                    value={formData.experiencia.dificultad}
                    onChange={(e) => handleInputChange('experiencia', 'dificultad', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['experiencia.dificultad'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar dificultad</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Moderada">Moderada</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Extrema">Extrema</option>
                  </select>
                  {errors['experiencia.dificultad'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['experiencia.dificultad']}</p>
                  )}
                </div>

                {/* Idioma */}
                <div>
                  <label htmlFor="idioma" className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Idioma *
                  </label>
                  <input
                    type="text"
                    id="idioma"
                    value={formData.experiencia.idioma}
                    onChange={(e) => handleInputChange('experiencia', 'idioma', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['experiencia.idioma'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Idioma de la experiencia"
                  />
                  {errors['experiencia.idioma'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['experiencia.idioma']}</p>
                  )}
                </div>

                {/* Grupo Máximo */}
                <div>
                  <label htmlFor="grupo_maximo" className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    Grupo Máximo *
                  </label>
                  <input
                    type="number"
                    id="grupo_maximo"
                    min="1"
                    value={formData.experiencia.grupo_maximo}
                    onChange={(e) => handleInputChange('experiencia', 'grupo_maximo', parseInt(e.target.value))}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['experiencia.grupo_maximo'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Número máximo de personas"
                  />
                  {errors['experiencia.grupo_maximo'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['experiencia.grupo_maximo']}</p>
                  )}
                </div>

                {/* Equipamiento Requerido */}
                <div className="md:col-span-2">
                  <label htmlFor="equipamiento_requerido" className="block text-sm font-medium text-gray-700 mb-2">
                    Equipamiento Requerido
                  </label>
                  <textarea
                    id="equipamiento_requerido"
                    value={formData.experiencia.equipamiento_requerido}
                    onChange={(e) => handleInputChange('experiencia', 'equipamiento_requerido', e.target.value)}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Equipamiento necesario para la experiencia"
                  />
                </div>

                {/* Punto de Encuentro */}
                <div className="md:col-span-2">
                  <label htmlFor="punto_de_encuentro" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Punto de Encuentro *
                  </label>
                  <input
                    type="text"
                    id="punto_de_encuentro"
                    value={formData.experiencia.punto_de_encuentro}
                    onChange={(e) => handleInputChange('experiencia', 'punto_de_encuentro', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['experiencia.punto_de_encuentro'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Lugar de encuentro para la experiencia"
                  />
                  {errors['experiencia.punto_de_encuentro'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['experiencia.punto_de_encuentro']}</p>
                  )}
                </div>

                {/* Número RNT */}
                <div>
                  <label htmlFor="numero_rnt" className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Número RNT *
                  </label>
                  <input
                    type="text"
                    id="numero_rnt"
                    value={formData.experiencia.numero_rnt}
                    onChange={(e) => handleInputChange('experiencia', 'numero_rnt', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['experiencia.numero_rnt'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Número de registro RNT"
                  />
                  {errors['experiencia.numero_rnt'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['experiencia.numero_rnt']}</p>
                  )}
                </div>

                {/* Incluye Transporte */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="incluye_transporte"
                    checked={formData.experiencia.incluye_transporte}
                    onChange={(e) => handleInputChange('experiencia', 'incluye_transporte', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="incluye_transporte" className="ml-2 block text-sm text-gray-900">
                    Incluye Transporte
                  </label>
                </div>

                {/* Guía Incluido */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="guia_incluido"
                    checked={formData.experiencia.guia_incluido}
                    onChange={(e) => handleInputChange('experiencia', 'guia_incluido', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="guia_incluido" className="ml-2 block text-sm text-gray-900">
                    Guía Incluido
                  </label>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saveLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};