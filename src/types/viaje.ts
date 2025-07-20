// Tipos e interfaces para la gestión de viajes

export interface DatosViaje {
  ruta_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad_total: number;
  capacidad_disponible: number;
  precio: number;
  guia_asignado: string;
  estado: string;
  id_transportador: string;
  activo: boolean;
}

export interface ActualizarViaje {
  ruta_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  capacidad_total?: number;
  capacidad_disponible?: number;
  precio?: number;
  guia_asignado?: string;
  estado?: string;
  id_transportador?: string;
  activo?: boolean;
}

export interface RespuestaViaje {
  id: string;
  ruta_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  capacidad_total?: number;
  capacidad_disponible?: number;
  precio?: number;
  guia_asignado?: string;
  estado?: string;
  id_transportador?: string;
  activo?: boolean;
}

export interface ViajeData extends RespuestaViaje {
  // Campos adicionales para la UI
  ruta_nombre?: string;
  transportador_nombre?: string;
  duracion_dias?: number;
  ocupacion_porcentaje?: number;
}

export interface ResponseListViajes {
  viajes: RespuestaViaje[];
  total: number;
  page: number;
  size: number;
}

export interface ResponseMessage {
  message: string;
  status?: number;
}

// Estadísticas específicas para viajes
export interface ViajeStatsData {
  totalViajes: number;
  viajesActivos: number;
  viajesEnCurso: number;
  capacidadPromedioDisponible: number;
}

// Datos para gráficos
export interface ViajeChartData {
  estadoDistribution: { estado: string; count: number; percentage: number }[];
  viajePorMes: { mes: string; count: number }[];
}

// Props para componentes
export interface ViajeTableProps {
  viajes: ViajeData[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  searchTerm: string;
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetails: (viaje: ViajeData) => void;
  onEdit: (viaje: ViajeData) => void;
  onDelete: (id: string) => void;
}

export interface ViajeStatsProps {
  stats: ViajeStatsData;
  loading: boolean;
}

export interface ViajeChartsProps {
  chartData: ViajeChartData;
  loading: boolean;
}

export interface ViajeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  viaje: ViajeData | null;
}

export interface EditViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  viaje: ViajeData | null;
  onSave: (data: ActualizarViaje) => void;
}

export interface CreateViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DatosViaje) => void;
}

// Estados posibles de un viaje
export const ESTADOS_VIAJE = {
  PROGRAMADO: 'programado',
  EN_CURSO: 'en_curso',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado'
} as const;

export type EstadoViaje = typeof ESTADOS_VIAJE[keyof typeof ESTADOS_VIAJE];
