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
  const [pageSize, setPageSize] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados para gráficos (datos simulados por ahora)
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<{ month: string; count: number }[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [recentLogins, setRecentLogins] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    } else {
      loadUsers();
    }
    
    // Cargar estadísticas independientemente
    loadStats();
    
    // Cargar datos para gráficas
    loadChartsData();
  }, [currentPage, pageSize, searchTerm]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      console.log('📊 Cargando estadísticas completas...');
      const statsData = await userService.getUserStats();
      console.log('📊 Estadísticas recibidas:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Mantener estadísticas en 0 si hay error
      setStats({
        total: 0,
        proveedores: 0,
        mayoristas: 0,
        administrativos: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const loadChartsData = async () => {
    try {
      setChartsLoading(true);
      console.log('📊 Cargando datos para gráficas...');
      
      // Obtener todos los usuarios para procesar las fechas
      const allUsersData = await userService.getUsers(1, 1000);
      const allUsers = Array.isArray(allUsersData) ? allUsersData : allUsersData.usuarios || [];
      
      console.log('📊 Total de usuarios para gráficas:', allUsers.length);
      
      // Procesar registros mensuales de los últimos 5 meses
      const monthlyData = processMonthlyRegistrations(allUsers);
      setMonthlyRegistrations(monthlyData);
      
      // Procesar logins recientes de los últimos 5 días
      const recentLoginsData = processRecentLogins(allUsers);
      setRecentLogins(recentLoginsData);
      
      console.log('📊 Datos mensuales procesados:', monthlyData);
      console.log('📊 Datos de logins recientes procesados:', recentLoginsData);
    } catch (error) {
      console.error('Error cargando datos para gráficas:', error);
      // Mantener datos vacíos si hay error
      setMonthlyRegistrations([]);
      setRecentLogins([]);
    } finally {
      setChartsLoading(false);
    }
  };

  const processMonthlyRegistrations = (users: User[]): { month: string; count: number }[] => {
    console.log('📅 === PROCESANDO REGISTROS MENSUALES ===');
    
    // Obtener la fecha actual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    console.log('📅 Fecha actual:', now.toISOString());
    console.log('📅 Año actual:', currentYear);
    console.log('📅 Mes actual (0-11):', currentMonth);
    
    // Generar los últimos 5 meses (incluyendo el actual)
    const months = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        monthName: date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      });
    }
    
    console.log('📅 Meses a procesar:', months);
    
    // Inicializar contadores
    const monthCounts: { [key: string]: number } = {};
    months.forEach(m => {
      monthCounts[m.key] = 0;
    });
    
    console.log('📅 Contadores inicializados:', monthCounts);
    
    // Procesar cada usuario
    users.forEach((user, index) => {
      if (index < 5) { // Solo mostrar los primeros 5 para debugging
        console.log(`📅 Usuario ${index + 1}:`, {
          email: user.email,
          fecha_registro: user.fecha_registro,
          tipo: typeof user.fecha_registro
        });
      }
      
      // Intentar obtener la fecha de registro
      let fechaRegistro: Date | null = null;
      
      // Lista de posibles campos de fecha (actualizada según la API)
      const possibleDateFields = [
        'fecha_registro',     // ✅ Campo principal según la API
        'fechaRegistro',
        'fecha_creacion',
        'fechaCreacion',
        'created_at',
        'createdAt',
        'date_created',
        'dateCreated'
      ];
      
      for (const field of possibleDateFields) {
        if (user[field as keyof User]) {
          try {
            const dateValue = user[field as keyof User];
            if (typeof dateValue === 'string') {
              fechaRegistro = new Date(dateValue);
              if (!isNaN(fechaRegistro.getTime())) {
                if (index < 5) {
                  console.log(`✅ Fecha válida encontrada en ${field}:`, fechaRegistro.toISOString());
                }
                break;
              }
            }
          } catch (error) {
            if (index < 5) {
              console.log(`❌ Error parseando ${field}:`, error);
            }
          }
        }
      }
      
      if (!fechaRegistro) {
        if (index < 5) {
          console.log(`❌ No se pudo obtener fecha para usuario:`, user.email);
        }
        return;
      }
      
      // Obtener año y mes de la fecha de registro
      const registroYear = fechaRegistro.getFullYear();
      const registroMonth = fechaRegistro.getMonth();
      const registroKey = `${registroYear}-${String(registroMonth + 1).padStart(2, '0')}`;
      
      if (index < 5) {
        console.log(`📅 Usuario ${index + 1} - Fecha procesada:`, {
          fecha: fechaRegistro.toISOString(),
          año: registroYear,
          mes: registroMonth,
          key: registroKey,
          estaEnRango: monthCounts.hasOwnProperty(registroKey)
        });
      }
      
      // Incrementar contador si está en el rango de los últimos 5 meses
      if (monthCounts.hasOwnProperty(registroKey)) {
        monthCounts[registroKey]++;
        if (index < 5) {
          console.log(`✅ Incrementado contador para ${registroKey}: ${monthCounts[registroKey]}`);
        }
      }
    });
    
    console.log('📅 Contadores finales:', monthCounts);
    
    // Convertir a formato para la gráfica
    const result = months.map(m => ({
      month: m.monthName,
      count: monthCounts[m.key] || 0
    }));
    
    console.log('📅 Resultado final para gráfica:', result);
    
    return result;
  };

  const processRecentLogins = (users: User[]): { date: string; count: number }[] => {
    console.log('🔐 === PROCESANDO LOGINS RECIENTES ===');
    
    // Obtener la fecha actual en la zona horaria local
    const now = new Date();
    
    // Crear fecha de hoy sin hora (medianoche local)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    console.log('🔐 Fecha actual:', now.toISOString());
    console.log('🔐 Hoy (sin hora):', today.toISOString());
    console.log('🔐 Zona horaria local:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    // Generar los últimos 5 días (incluyendo hoy)
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Crear la fecha en formato local para comparación
      const localDateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      days.push({
        date: date.toISOString(),
        dateKey: localDateKey, // YYYY-MM-DD en zona local
        displayName: date.toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }),
        dayNumber: date.getDate(),
        monthNumber: date.getMonth() + 1,
        yearNumber: date.getFullYear()
      });
    }
    
    console.log('🔐 Días a procesar:', days);
    
    // Inicializar contadores
    const dayCounts: { [key: string]: number } = {};
    days.forEach(d => {
      dayCounts[d.dateKey] = 0;
    });
    
    console.log('🔐 Contadores inicializados:', dayCounts);
    
    // Procesar cada usuario
    users.forEach((user, index) => {
      if (index < 5) { // Solo mostrar los primeros 5 para debugging
        console.log(`🔐 Usuario ${index + 1}:`, {
          email: user.email,
          ultimo_login: user.ultimo_login,
          tipo: typeof user.ultimo_login
        });
      }
      
      // Verificar si tiene último login
      if (!user.ultimo_login) {
        if (index < 5) {
          console.log(`❌ Usuario ${index + 1} sin último login:`, user.email);
        }
        return;
      }
      
      try {
        const loginDate = new Date(user.ultimo_login);
        
        if (isNaN(loginDate.getTime())) {
          if (index < 5) {
            console.log(`❌ Fecha de login inválida para usuario ${index + 1}:`, user.ultimo_login);
          }
          return;
        }
        
        // CORRECCIÓN: Obtener la fecha en zona horaria local, no UTC
        const loginYear = loginDate.getFullYear();
        const loginMonth = loginDate.getMonth() + 1; // getMonth() devuelve 0-11
        const loginDay = loginDate.getDate();
        const loginDateKey = `${loginYear}-${String(loginMonth).padStart(2, '0')}-${String(loginDay).padStart(2, '0')}`;
        
        if (index < 5) {
          console.log(`🔐 Usuario ${index + 1} - Login procesado:`, {
            fechaOriginal: user.ultimo_login,
            fechaParseada: loginDate.toISOString(),
            fechaLocal: loginDate.toLocaleDateString('es-ES'),
            año: loginYear,
            mes: loginMonth,
            día: loginDay,
            fechaKey: loginDateKey,
            estaEnRango: dayCounts.hasOwnProperty(loginDateKey),
            diasDisponibles: Object.keys(dayCounts)
          });
        }
        
        // Incrementar contador si está en el rango de los últimos 5 días
        if (dayCounts.hasOwnProperty(loginDateKey)) {
          dayCounts[loginDateKey]++;
          if (index < 5) {
            console.log(`✅ Incrementado contador para ${loginDateKey}: ${dayCounts[loginDateKey]}`);
          }
        } else {
          if (index < 5) {
            console.log(`⚠️ Login fuera del rango de 5 días: ${loginDateKey} (disponibles: ${Object.keys(dayCounts).join(', ')})`);
          }
        }
        
      } catch (error) {
        if (index < 5) {
          console.log(`❌ Error procesando login para usuario ${index + 1}:`, error);
        }
      }
    });
    
    console.log('🔐 Contadores finales:', dayCounts);
    console.log('🔐 Días procesados:', days.map(d => ({ 
      fecha: d.displayName, 
      key: d.dateKey, 
      count: dayCounts[d.dateKey] 
    })));
    
    // Convertir a formato para la gráfica
    const result = days.map(d => ({
      date: d.date,
      count: dayCounts[d.dateKey] || 0
    }));
    
    console.log('🔐 Resultado final para gráfica:', result);
    
    // Verificación adicional para debugging
    console.log('🔐 === VERIFICACIÓN FINAL ===');
    result.forEach((item, index) => {
      const displayDate = new Date(item.date).toLocaleDateString('es-ES', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      });
      console.log(`Día ${index + 1}: ${displayDate} = ${item.count} logins`);
    });
    
    return result;
  };

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
      
      // Recargar estadísticas después de crear usuario
      await loadStats();
      
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

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      // Si no hay término de búsqueda, cargar usuarios normalmente
      setIsSearching(false);
      setSearchTerm('');
      loadUsers();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      
      console.log('🔍 Iniciando búsqueda global:', term);
      
      // Obtener todos los usuarios para búsqueda local
      const allUsersData = await userService.getUsers(1, 1000);
      const allUsers = Array.isArray(allUsersData) ? allUsersData : allUsersData.usuarios || [];
      
      // Filtrar localmente
      const filteredUsers = allUsers.filter(user =>
        user.nombre.toLowerCase().includes(term.toLowerCase()) ||
        user.apellido.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.tipo_usuario.toLowerCase().includes(term.toLowerCase())
      );
      
      // Aplicar paginación manual
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedResults);
      setTotalUsers(filteredUsers.length);
      setTotalPages(Math.ceil(filteredUsers.length / pageSize));
      
      console.log(`✅ Búsqueda local completada: ${filteredUsers.length} resultados encontrados`);
      
      if (filteredUsers.length === 0) {
        showNotification('error', `No se encontraron usuarios que coincidan con "${term}"`);
      }
    } catch (error) {
      console.error('Error en búsqueda local:', error);
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(0);
      showNotification('error', 'Error al buscar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    
    if (!term.trim()) {
      setIsSearching(false);
      loadUsers();
    } else {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    loadUsers();
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
      
      // Recargar estadísticas después de eliminar usuario
      await loadStats();
      
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
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
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
        chartsLoading={chartsLoading}
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