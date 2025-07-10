import { UserData } from '../types/auth';

// Función para detectar si estamos en desarrollo
const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname.includes('localhost');
};

// Función para establecer cookie con múltiples intentos
export const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // Flag para evitar múltiples mensajes de éxito/error
  let cookieSuccessfullySet = false;
  
  console.log('🍪 Intentando establecer cookie:', name);
  console.log('🌐 Entorno:', isDevelopment() ? 'DESARROLLO' : 'PRODUCCIÓN');
  console.log('📍 Dominio:', window.location.hostname);
  console.log('🔒 Protocolo:', window.location.protocol);
  
  // Intentar múltiples configuraciones de cookie
  const cookieConfigs = [
    // Configuración básica (más permisiva)
    `${name}=${value}; expires=${expires.toUTCString()}; path=/`,
    
    // Con SameSite=Lax (recomendado para desarrollo)
    `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`,
    
    // Con SameSite=None (para algunos casos especiales)
    `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=None; Secure`,
    
    // Sin SameSite (fallback para navegadores antiguos)
    `${name}=${value}; expires=${expires.toUTCString()}; path=/; Secure`
  ];
  
  // Intentar cada configuración hasta que una funcione
  for (let i = 0; i < cookieConfigs.length; i++) {
    try {
      const config = cookieConfigs[i];
      
      // Saltar configuraciones con Secure en HTTP
      if (config.includes('Secure') && window.location.protocol === 'http:') {
        console.log(`⚠️ Saltando configuración ${i + 1} (requiere HTTPS)`);
        continue;
      }
      
      console.log(`🔄 Intentando configuración ${i + 1}:`, config);
      document.cookie = config;
      
      // Verificar inmediatamente si funcionó
      setTimeout(() => {
        // Si ya se estableció exitosamente, no hacer nada más
        if (cookieSuccessfullySet) {
          return;
        }
        
        const testCookie = getCookie(name);
        if (testCookie) {
          cookieSuccessfullySet = true;
          console.log(`✅ Configuración ${i + 1} EXITOSA - Cookie establecida`);
          
          // También guardar en localStorage como respaldo
          try {
            localStorage.setItem(`backup_${name}`, value);
            console.log('💾 Token también guardado en localStorage como respaldo');
          } catch (storageError) {
            console.warn('⚠️ No se pudo guardar en localStorage:', storageError);
          }
          
          return;
        } else if (i === cookieConfigs.length - 1) {
          // Solo mostrar error si ninguna configuración funcionó
          console.error('❌ Ninguna configuración de cookie funcionó');
          
          // Como último recurso, usar localStorage
          try {
            localStorage.setItem(name, value);
            localStorage.setItem(`${name}_expires`, expires.getTime().toString());
            console.log('💾 Usando localStorage como alternativa a cookies');
          } catch (storageError) {
            console.error('❌ Tampoco se pudo usar localStorage:', storageError);
          }
        }
      }, 50);
      
    } catch (error) {
      console.error(`❌ Error con configuración ${i + 1}:`, error);
    }
  }
};

export const decodeJWT = (token: string): UserData | null => {
  try {
    if (!token || typeof token !== 'string') {
      console.log('❌ Token inválido o vacío');
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Token JWT no tiene 3 partes');
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const userData = JSON.parse(jsonPayload);
    console.log('🔓 Token decodificado exitosamente:', {
      id: userData.id,
      email: userData.email,
      tipo_usuario: userData.tipo_usuario,
      exp: new Date(userData.exp * 1000).toLocaleString()
    });
    
    return userData;
  } catch (error) {
    console.error('❌ Error decodificando JWT:', error);
    return null;
  }
};

export const isTokenExpired = (exp: number): boolean => {
  const now = Date.now();
  const expTime = exp * 1000;
  const isExpired = now >= expTime;
  
  console.log('⏰ Verificando expiración del token:', {
    ahora: new Date(now).toLocaleString(),
    expira: new Date(expTime).toLocaleString(),
    expirado: isExpired
  });
  
  return isExpired;
};

export const getCookie = (name: string): string | null => {
  console.log('🔍 Buscando cookie:', name);
  console.log('🍪 Todas las cookies:', document.cookie);
  
  // Primero intentar obtener de cookies
  if (document.cookie) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift() || null;
      if (cookieValue) {
        console.log('✅ Cookie encontrada en cookies del navegador');
        return cookieValue;
      }
    }
  }
  
  // Si no se encuentra en cookies, intentar localStorage
  try {
    const localStorageValue = localStorage.getItem(name);
    if (localStorageValue) {
      console.log('✅ Token encontrado en localStorage');
      
      // Verificar si tiene fecha de expiración
      const expiresStr = localStorage.getItem(`${name}_expires`);
      if (expiresStr) {
        const expires = parseInt(expiresStr);
        if (Date.now() > expires) {
          console.log('⏰ Token en localStorage expirado, eliminando');
          localStorage.removeItem(name);
          localStorage.removeItem(`${name}_expires`);
          return null;
        }
      }
      
      return localStorageValue;
    }
    
    // También verificar el backup
    const backupValue = localStorage.getItem(`backup_${name}`);
    if (backupValue) {
      console.log('✅ Token encontrado en backup de localStorage');
      return backupValue;
    }
  } catch (storageError) {
    console.warn('⚠️ Error accediendo a localStorage:', storageError);
  }
  
  console.log('❌ Token no encontrado en ningún lugar');
  return null;
};

export const deleteCookie = (name: string): void => {
  console.log('🗑️ Eliminando token de todos los lugares:', name);
  
  // Eliminar de cookies con múltiples configuraciones
  const expiredDate = 'Thu, 01 Jan 1970 00:00:00 UTC';
  const deleteConfigs = [
    `${name}=; expires=${expiredDate}; path=/`,
    `${name}=; expires=${expiredDate}; path=/; SameSite=Lax`,
    `${name}=; expires=${expiredDate}; path=/; SameSite=Strict`,
    `${name}=; expires=${expiredDate}; path=/; SameSite=None; Secure`,
    `${name}=; expires=${expiredDate}; path=/; domain=${window.location.hostname}`,
    `${name}=; expires=${expiredDate}; path=/; domain=.${window.location.hostname}`
  ];
  
  deleteConfigs.forEach((config, index) => {
    try {
      // Saltar configuraciones con Secure en HTTP
      if (config.includes('Secure') && window.location.protocol === 'http:') {
        return;
      }
      document.cookie = config;
    } catch (error) {
      console.warn(`⚠️ Error eliminando cookie con configuración ${index + 1}:`, error);
    }
  });
  
  // Eliminar de localStorage
  try {
    localStorage.removeItem(name);
    localStorage.removeItem(`${name}_expires`);
    localStorage.removeItem(`backup_${name}`);
    console.log('🗑️ Token eliminado de localStorage');
  } catch (storageError) {
    console.warn('⚠️ Error eliminando de localStorage:', storageError);
  }
  
  // Verificar que se eliminó
  setTimeout(() => {
    const stillExists = getCookie(name);
    console.log('🗑️ Token eliminado completamente:', stillExists ? 'NO' : 'SÍ');
  }, 100);
};

export const getUserFromCookie = (): UserData | null => {
  console.log('👤 Obteniendo usuario desde almacenamiento...');
  
  const token = getCookie('auth_token');
  if (!token) {
    console.log('❌ No se encontró token en ningún lugar');
    return null;
  }
  
  console.log('✅ Token encontrado');
  
  const userData = decodeJWT(token);
  if (!userData) {
    console.log('❌ No se pudo decodificar el token');
    deleteCookie('auth_token');
    return null;
  }
  
  if (isTokenExpired(userData.exp)) {
    console.log('⏰ Token expirado, eliminando');
    deleteCookie('auth_token');
    return null;
  }
  
  console.log('✅ Sesión válida encontrada para:', userData.email);
  return userData;
};

// Función adicional para debugging
export const debugCookies = () => {
  console.log('🐛 DEBUG - Estado completo de almacenamiento:');
  console.log('📍 Dominio:', window.location.hostname);
  console.log('🌐 Protocolo:', window.location.protocol);
  console.log('🍪 Cookies del navegador:', document.cookie);
  
  try {
    console.log('💾 localStorage auth_token:', localStorage.getItem('auth_token') ? 'EXISTE' : 'NO EXISTE');
    console.log('💾 localStorage backup_auth_token:', localStorage.getItem('backup_auth_token') ? 'EXISTE' : 'NO EXISTE');
  } catch (error) {
    console.log('❌ Error accediendo a localStorage:', error);
  }
  
  console.log('🔑 Token final obtenido:', getCookie('auth_token') ? 'EXISTE' : 'NO EXISTE');
};