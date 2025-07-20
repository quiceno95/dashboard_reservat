export interface MayoristaData {
  id: string;
  nombre: string;
  apellidos: string;
  descripcion?: string | null;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  recurente: boolean;
  usuario_creador: string;
  verificado: boolean;
  intereses?: string;
  tipo_documento: string;
  numero_documento: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateMayoristaData {
  nombre: string;
  apellidos: string;
  descripcion?: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  recurente: boolean;
  usuario_creador: string;
  verificado: boolean;
  intereses?: string;
  tipo_documento: string;
  numero_documento: string;
  activo: boolean;
}

export interface UpdateMayoristaData {
  nombre?: string;
  apellidos?: string;
  descripcion?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  recurente?: boolean;
  usuario_creador?: string;
  verificado?: boolean;
  intereses?: string;
  tipo_documento?: string;
  numero_documento?: string;
  activo?: boolean;
}

export interface MayoristaStats {
  total: number;
  verificados: number;
  recurrentes: number;
  activos: number;
}

export interface MayoristaChartData {
  estados: Array<{
    estado: string;
    count: number;
  }>;
  verificacion: Array<{
    tipo: string;
    count: number;
  }>;
}
