// Tipos e interfaces para la gestión de rutas

export interface DatosRuta {
  nombre: string;
  descripcion: string;
  duracion_estimada: number;
  activo: boolean;
  puntos_interes: string;
  recomendada: boolean;
  origen: string;
  destino: string;
  precio: string;
}

export interface RutaData extends DatosRuta {
  id: string;
}

export interface ActualizarRuta {
  nombre?: string | null;
  descripcion?: string | null;
  duracion_estimada?: number | null;
  activo?: boolean | null;
  puntos_interes?: string | null;
  recomendada?: boolean | null;
  origen?: string | null;
  destino?: string | null;
  precio?: string | null;
}

export interface DatosOrigenDestino {
  origen: string;
  destino: string;
}

export interface RutasResponse {
  rutas: RutaData[];
  total: number;
  page: number;
  size: number;
}

export interface RutaStats {
  totalRutas: number;
  rutasActivas: number;
  rutasRecomendadas: number;
  duracionPromedio: number;
}

export interface RutaChartData {
  estados: { name: string; value: number; color: string }[];
  recomendadas: { name: string; value: number; color: string }[];
}

// Props para componentes
export interface RutaTableProps {
  rutas: RutaData[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (term: string) => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface RutaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruta?: RutaData | null;
  onSave?: () => void;
}
