// Tipos e interfaces para la sección de Servicios
export interface DatosServicio {
  proveedor_id: string;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  relevancia: string;
  ciudad: string;
  departamento: string;
  ubicacion: string;
  detalles_del_servicio: string;
}

export interface RespuestaServicio {
  id_servicio: string;
  proveedor_id: string;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  relevancia: string;
  ciudad: string;
  departamento: string;
  ubicacion: string;
  detalles_del_servicio: string;
}

export interface ActualizarServicio {
  id_servicio: string;
  proveedor_id: string;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  relevancia: string;
  ciudad: string;
  departamento: string;
  ubicacion: string;
  detalles_del_servicio: string;
}

export interface ResponseListServicios {
  servicios: RespuestaServicio[];
  total: number;
  page: number;
  size: number;
}

// Tipos para la UI
export interface ServicioData {
  id_servicio: string;
  proveedor_id: string;
  proveedorNombre: string;
  nombre: string;
  descripcion: string;
  tipo_servicio: string;
  precio: number;
  moneda: string;
  precioFormateado: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fechaCreacionFormateada: string;
  fechaActualizacionFormateada: string;
  relevancia: string;
  ciudad: string;
  departamento: string;
  ubicacionCompleta: string;
  ubicacion: string;
  detalles_del_servicio: string;
}

// Tipos para estadísticas
export interface ServicioStatsData {
  totalServicios: number;
  serviciosActivos: number;
  serviciosPorTipo: number;
  proveedoresConServicios: number;
}

// Tipos para gráficos
export interface ServicioChartData {
  tipoServicioData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ciudadData: Array<{
    ciudad: string;
    cantidad: number;
  }>;
}

// Props para componentes
export interface ServicioTableProps {
  servicios: ServicioData[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (servicio: ServicioData) => void;
  onEdit: (servicio: ServicioData) => void;
  onDelete: (id: string) => void;
}

export interface ServicioStatsProps {
  stats: ServicioStatsData;
  loading: boolean;
}

export interface ServicioChartsProps {
  chartData: ServicioChartData;
  loading: boolean;
}

export interface ServicioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioData | null;
}

export interface EditServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioData | null;
  onSave: (data: ActualizarServicio) => Promise<void>;
}

export interface CreateServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DatosServicio) => Promise<void>;
}
