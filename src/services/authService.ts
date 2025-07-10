import { LoginCredentials, LoginResponse, ApiError } from '../types/auth';
import { getCookie } from '../utils/auth';

// Usar el proxy configurado en Vite para evitar problemas de CORS
const API_BASE_URL = '/api/v1';

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('🔐 === INICIO DEL PROCESO DE LOGIN (VÍA PROXY) ===');
    console.log('📧 Email:', credentials.email);
    console.log('🌐 URL del endpoint (VÍA PROXY):', `${API_BASE_URL}/usuarios/admin`);
    console.log('📦 Payload:', { email: credentials.email, contraseña: '[HIDDEN]' });
    
    const response = await fetch(`${API_BASE_URL}/usuarios/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        contraseña: credentials.contraseña
      }),
      credentials: 'include',
    });

    console.log('📡 === RESPUESTA DEL SERVIDOR (VÍA PROXY) ===');
    console.log('🔢 Status:', response.status);
    console.log('📝 Status Text:', response.statusText);
    console.log('✅ OK:', response.ok);
    console.log('🌐 URL:', response.url);
    console.log('📋 Headers completos:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Verificar si la respuesta tiene contenido antes de parsear JSON
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    console.log('📄 Content-Type:', contentType);
    console.log('📏 Content-Length:', contentLength);
    
    let data;
    if (contentLength === '0' || !contentType?.includes('application/json')) {
      console.log('⚠️ Respuesta sin contenido JSON o vacía');
      data = {};
    } else {
      try {
        const responseText = await response.text();
        console.log('📜 === CONTENIDO CRUDO DE LA RESPUESTA ===');
        console.log('Longitud del texto:', responseText.length);
        console.log('Texto completo:', responseText);
        console.log('Primeros 200 caracteres:', responseText.substring(0, 200));
        
        if (responseText.trim() === '') {
          console.log('⚠️ Respuesta completamente vacía del servidor');
          data = {};
        } else {
          data = JSON.parse(responseText);
          console.log('✅ === DATOS PARSEADOS EXITOSAMENTE ===');
          console.log('Tipo de dato:', typeof data);
          console.log('Datos completos:', data);
          console.log('Propiedades del objeto:', Object.keys(data));
          if (data.access_token) {
            console.log('🔑 Token encontrado en respuesta (primeros 50 chars):', data.access_token.substring(0, 50) + '...');
          } else {
            console.log('❌ NO se encontró access_token en la respuesta');
          }
        }
      } catch (parseError) {
        console.error('❌ === ERROR AL PARSEAR JSON ===');
        console.error('Error:', parseError);
        console.error('Mensaje del error:', parseError.message);
        // Don't throw error here, let the response validation handle it
      }
    }

    if (!response.ok) {
      console.error('❌ === RESPUESTA NO EXITOSA ===');
      console.error('Status:', response.status);
      console.error('Data recibida:', data);
      
      let errorMessage = data?.detail || data?.message || `Error ${response.status}: ${response.statusText}`;
      
      switch (response.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos. Verifica el formato del email y contraseña.';
          break;
        case 401:
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
          break;
        case 403:
          errorMessage = 'Usuario sin permisos de administrador.';
          break;
        case 404:
          errorMessage = 'Endpoint no encontrado. Verifica la configuración de la API.';
          break;
        case 422:
          errorMessage = 'Datos de entrada no válidos. Verifica el formato de los campos.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. El servidor está experimentando problemas.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Servidor no disponible temporalmente. Inténtalo más tarde.';
          break;
        default:
          errorMessage = `Error del servidor (${response.status}): ${response.statusText}`;
      }
      
      console.error('Error de API:', errorMessage, data);
      throw new Error(errorMessage);
    }

    console.log('✅ === RESPUESTA EXITOSA ===');
    console.log('Data final:', data);
    
    // Si la respuesta es exitosa pero no hay token, verificar cookies
    if (!data.access_token) {
      console.log('⚠️ === NO HAY TOKEN EN RESPUESTA, VERIFICANDO COOKIES ===');
      
      // Esperar un momento para que las cookies se establezcan
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Intentar obtener el token de las cookies
      const cookieToken = getCookie('auth_token');
      console.log('🍪 Token en cookies:', cookieToken ? cookieToken.substring(0, 50) + '...' : 'NO ENCONTRADO');
      
      if (cookieToken) {
        console.log('✅ Token encontrado en cookies después del login');
        data.access_token = cookieToken;
      } else {
        console.warn('❌ No se encontró token ni en respuesta ni en cookies');
      }
    } else {
      console.log('✅ Token encontrado directamente en la respuesta');
    }

    console.log('🏁 === FIN DEL PROCESO DE LOGIN (VÍA PROXY) ===');
    console.log('Resultado final:', { 
      hasToken: !!data.access_token, 
      tokenPreview: data.access_token ? data.access_token.substring(0, 50) + '...' : 'N/A'
    });
    
    return data;
  } catch (error) {
    console.error('💥 === ERROR GENERAL EN LOGIN (VÍA PROXY) ===');
    console.error('Tipo de error:', typeof error);
    console.error('Error completo:', error);
    console.error('Mensaje:', error instanceof Error ? error.message : 'Error desconocido');
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack disponible');
    
    if (error instanceof Error) {
      // Si es un error de red
      if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('CORS')) {
        console.error('🌐 Error de red detectado');
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      }
      throw error;
    }
    throw new Error('Error de conexión inesperado');
  }
};