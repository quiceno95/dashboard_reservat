export interface Proveedor {
  id_proveedor: string;
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
}

export interface ExperienciaData {
  id_experiencia: string;
  duracion: number;
  dificultad: string;
  idioma: string;
  incluye_transporte: boolean;
  grupo_maximo: number;
  guia_incluido: boolean;
  equipamiento_requerido: string;
  punto_de_encuentro: string;
  numero_rnt: string;
}

export interface ExperienciaCompleta {
  // Datos del proveedor
  id_proveedor: string;
  proveedor_nombre: string;
  proveedor_email: string;
  proveedor_telefono: string;
  proveedor_ciudad: string;
  proveedor_pais: string;
  proveedor_rating: number;
  proveedor_verificado: boolean;
  proveedor_activo: boolean;
  fecha_registro: string;
  
  // Datos de la experiencia
  id_experiencia: string;
  duracion: number;
  dificultad: string;
  idioma: string;
  incluye_transporte: boolean;
  grupo_maximo: number;
  guia_incluido: boolean;
  equipamiento_requerido: string;
  punto_de_encuentro: string;
  numero_rnt: string;
}

export interface ExperienciaApiResponse {
  data: {
    proveedor: Proveedor;
    experiencia: ExperienciaData;
  }[];
  total: number;
  page: number;
  size: number;
}