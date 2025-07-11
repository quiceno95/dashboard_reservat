export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  tipo_usuario: 'administrador' | 'proveedor' | 'mayorista' | 'cliente';
  activo: boolean;
  fecha_registro: string;  // ✅ Campo correcto según la API
  ultimo_login: string | null;
}