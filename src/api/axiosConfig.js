import axios from 'axios';
import { API_BASE_URL, API_VERSION, STORAGE_KEYS } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST: Inyectar token JWT automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE: Manejo centralizado de errores
axiosInstance.interceptors.response.use(
  (response) => response.data, // Retorna solo data
  (error) => {
    if (error.response) {
      // El servidor respondió con un status fuera del rango 2xx
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token expirado o inválido
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
      }
      
      return Promise.reject(data.message || 'Error en la petición');
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return Promise.reject('No se pudo conectar con el servidor');
    } else {
      // Algo pasó al configurar la petición
      return Promise.reject(error.message);
    }
  }
);

export default axiosInstance;
