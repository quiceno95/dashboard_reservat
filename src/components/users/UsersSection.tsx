import React, { useState, useEffect } from 'react';
import { UserStats } from './UserStats';
import { UserTable } from './UserTable';
import { UserCharts } from './UserCharts';
import { CreateUserModal } from './CreateUserModal';
import { User } from '../../types/user';
import { userService } from '../../services/userService';
import { AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { Download } from 'lucide-react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    total: 0,
    proveedores: 0,
    mayoristas: 0,
    administrativos: 0
  });

  // Estados para gráficos (datos simulados por ahora)
  const [monthlyRegistrations] = useState([
    { month: 'Ene', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 38 },
    { month: 'Abr', count: 61 },
    { month: 'May', count: 55 },
    { month: 'Jun', count: 67 }
  ]);

  const [recentLogins] = useState([
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), count: 23 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), count: 31 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), count: 18 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), count: 42 },
    { date: new Date().toISOString(), count: 35 }
  ]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    // Calcular estadísticas cuando cambien los usuarios
    const total = users.length;
    const proveedores = users.filter(u => u.tipo_usuario === 'proveedor').length;
    const mayoristas = users.filter(u => u.tipo_usuario === 'mayorista').length;
    const administrativos = users.filter(u => u.tipo_usuario === 'administrador').length;

    setStats({ total, proveedores, mayoristas, administrativos });
  }, [users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getUsers(currentPage, pageSize);
      
      // Handle paginated response
      if (usersData && typeof usersData === 'object' && 'usuarios' in usersData) {
        setUsers(usersData.usuarios || []);
        setTotalUsers(usersData.total || 0);
        setTotalPages(Math.ceil((usersData.total || 0) / pageSize));
      } else if (Array.isArray(usersData)) {
        // Fallback for non-paginated response
        setUsers(usersData);
        setTotalUsers(usersData.length);
        setTotalPages(1);
      } else {
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(0);
      showNotification('error', 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: {
    nombre: string;
    apellido: string;
    email: string;
    tipo_usuario: string;
    contraseña: string;
  }) => {
    try {
      setCreateLoading(true);
      const result = await userService.createUser(userData);
      
      // Close modal
      setCreateModalOpen(false);
      
      // Reload users to show the new user
      await loadUsers();
      
      // Show success message from API or default message
      const successMessage = result.message || 'Usuario creado correctamente';
      
      // Show success alert
      await Swal.fire({
        title: '¡Usuario Creado!',
        text: successMessage,
        icon: 'success',
        confirmButtonColor: '#059669',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error('Error creando usuario:', error);
      
      // Show the specific error message from the API
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al crear el usuario';
      
      // Show error alert
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      setExportLoading(true);
      
      // Obtener todos los usuarios (sin paginación para la exportación)
      const allUsersData = await userService.getUsers(1, 1000); // Obtener hasta 1000 usuarios
      const allUsers = Array.isArray(allUsersData) ? allUsersData : allUsersData.usuarios || [];
      
      // === DEPURACIÓN COMPLETA ===
      console.log('🔍 === DEPURACIÓN DE EXPORTACIÓN DE USUARIOS ===');
      console.log('📊 Total de usuarios obtenidos:', allUsers.length);
      
      if (allUsers.length > 0) {
        console.log('🔍 === ESTRUCTURA COMPLETA DEL PRIMER USUARIO ===');
        console.log('Usuario completo:', allUsers[0]);
        console.log('Propiedades disponibles:', Object.keys(allUsers[0]));
        console.log('Tipos de cada propiedad:');
        Object.keys(allUsers[0]).forEach(key => {
          console.log(`  ${key}: ${typeof allUsers[0][key]} = ${allUsers[0][key]}`);
        });
        
        // Buscar campos que podrían ser fecha de creación
        const possibleDateFields = Object.keys(allUsers[0]).filter(key => 
          key.toLowerCase().includes('fecha') || 
          key.toLowerCase().includes('created') || 
          key.toLowerCase().includes('date') ||
          key.toLowerCase().includes('creacion') ||
          key.toLowerCase().includes('registro')
        );
        console.log('📅 Campos que podrían ser fechas:', possibleDateFields);
        
        possibleDateFields.forEach(field => {
          console.log(`📅 ${field}: ${allUsers[0][field]} (tipo: ${typeof allUsers[0][field]})`);
        });
      }
      
      if (allUsers.length === 0) {
        await Swal.fire({
          title: 'Sin datos',
          text: 'No hay usuarios para exportar',
          icon: 'info',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-xl font-bold text-gray-900',
            confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
          },
          buttonsStyling: false
        });
        return;
      }

      // Función para obtener fecha de creación con múltiples intentos
      const getFechaCreacion = (user: any) => {
        console.log(`🔍 Depurando fecha_registro para usuario: ${user.email || user.id}`);
        
        // Lista de posibles nombres para el campo de fecha de creación (ACTUALIZADA)
        const possibleFields = [
          'fecha_registro',     // ✅ ESTE ES EL CAMPO CORRECTO SEGÚN LA API
          'fechaRegistro',
          'fecha_creacion',
          'fechaCreacion', 
          'created_at',
          'createdAt',
          'date_created',
          'dateCreated',
          'registration_date',
          'registrationDate',
          'created',
          'date'
        ];
        
        console.log('📅 Campos de fecha disponibles:', {
          fecha_registro: user.fecha_registro,        // ✅ CAMPO PRINCIPAL
          fechaRegistro: user.fechaRegistro,
          fecha_creacion: user.fecha_creacion,
          fechaCreacion: user.fechaCreacion,
          created_at: user.created_at,
          createdAt: user.createdAt,
          date_created: user.date_created,
          dateCreated: user.dateCreated,
          registration_date: user.registration_date,
          registrationDate: user.registrationDate,
          created: user.created,
          date: user.date
        });
        
        for (const field of possibleFields) {
          if (user[field]) {
            console.log(`✅ Fecha encontrada en campo: ${field} = ${user[field]} (${typeof user[field]})`);
            try {
              const date = new Date(user[field]);
              if (!isNaN(date.getTime())) {
                const formattedDate = date.toLocaleString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
                console.log(`✅ Fecha válida parseada y formateada: ${formattedDate}`);
                return formattedDate;
              } else {
                console.log(`❌ Fecha inválida en campo ${field}: ${user[field]}`);
              }
            } catch (error) {
              console.log(`❌ Error parseando fecha en campo ${field}:`, error);
            }
          }
        }
        
        console.log('❌ No se encontró ningún campo de fecha válido para usuario:', user.email || user.id);
        return 'N/A';
      };

      // Preparar los datos para Excel
      const excelData = allUsers.map((user, index) => ({
        'No.': index + 1,
        'ID': user.id,
        'Nombre': user.nombre,
        'Apellido': user.apellido,
        'Email': user.email,
        'Tipo de Usuario': user.tipo_usuario,
        'Estado': user.activo ? 'Activo' : 'Inactivo',
        'Fecha de Creación': getFechaCreacion(user),
        'Último Login': user.ultimo_login ? new Date(user.ultimo_login).toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) : 'Nunca'
      }));

      // Crear el libro de trabajo
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 5 },   // No.
        { wch: 15 },  // ID
        { wch: 20 },  // Nombre
        { wch: 20 },  // Apellido
        { wch: 30 },  // Email
        { wch: 15 },  // Tipo de Usuario
        { wch: 10 },  // Estado
        { wch: 22 },  // Fecha de Creación (más ancho para fecha y hora)
        { wch: 22 }   // Último Login (más ancho para fecha y hora)
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

      // Generar el nombre del archivo con fecha y hora
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_');
      const fileName = `usuarios_export_${timestamp}.xlsx`;

      // Descargar el archivo
      XLSX.writeFile(workbook, fileName);

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: '¡Exportación Exitosa!',
        html: `
          <div class="text-center">
            <div class="mb-4">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-2">Se han exportado <strong>${allUsers.length}</strong> usuarios</p>
            <p class="text-sm text-gray-500">Archivo: <strong>${fileName}</strong></p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#059669',
        confirmButtonText: 'Perfecto',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 4000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error('Error exportando usuarios:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al exportar los usuarios';
      
      await Swal.fire({
        title: 'Error en la Exportación',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Find the user to get their name for the confirmation
    const userToDelete = users.find(user => user.id === userId);
    const userName = userToDelete ? `${userToDelete.nombre} ${userToDelete.apellido}` : 'este usuario';

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <p class="text-gray-600 mb-2">Vas a eliminar al usuario:</p>
          <p class="font-semibold text-gray-900 text-lg">${userName}</p>
          <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        title: 'text-xl font-bold text-gray-900',
        confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      },
      buttonsStyling: false,
      focusConfirm: false,
      focusCancel: true
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      console.log('Intentando eliminar usuario con ID:', userId);
      const result = await userService.deleteUser(userId);
      console.log('Usuario eliminado exitosamente:', result);
      
      // Update the local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // Update total count
      setTotalUsers(prev => prev - 1);
      
      // If current page becomes empty and it's not the first page, go to previous page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Reload current page to get updated data
        loadUsers();
      }
      
      // Show success message from API or default message
      const successMessage = (result && typeof result === 'object' && 'message' in result) 
        ? result.message 
        : 'Usuario eliminado correctamente';
      
      // Show success alert
      await Swal.fire({
        title: '¡Eliminado!',
        text: successMessage,
        icon: 'success',
        confirmButtonColor: '#059669',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      
      // Show the specific error message from the API
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al eliminar el usuario';
      
      // Show error alert
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">
            Administra todos los usuarios del sistema
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportUsers}
            disabled={exportLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {exportLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Exportar Usuarios</span>
              </>
            )}
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Usuario</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <UserStats
        totalUsers={totalUsers}
        proveedores={stats.proveedores}
        mayoristas={stats.mayoristas}
        administrativos={stats.administrativos}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        onDelete={handleDeleteUser}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Charts */}
      <UserCharts
        monthlyRegistrations={monthlyRegistrations}
        recentLogins={recentLogins}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateUser}
        loading={createLoading}
      />
    </div>
  );
};