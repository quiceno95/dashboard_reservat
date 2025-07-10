export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  tipo_usuario: 'administrador' | 'proveedor' | 'mayorista' | 'cliente';
  activo: boolean;
  fecha_creacion: string;
  ultimo_login: string | null;
}