import axios from "axios";
import { API_BASE_URL, API_VERSION, STORAGE_KEYS } from "../utils/constants";

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// REQUEST: inyectar JWT automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE: manejo centralizado de errores
// IMPORTANTE: NO hacer return response.data aquí.
// Los servicios acceden a response.data ellos mismos.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // NO desloguear si es la verificación inicial del token
        // — puede fallar si el backend rechaza tokens recién creados
        const isVerifyCall = error.config?.url?.includes("verifytoken");

        if (!isVerifyCall) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = "/login";
        }
      }
      
      return Promise.reject(data?.message || "Error en la petición");
    } else if (error.request) {
      return Promise.reject("No se pudo conectar con el servidor");
    }
    return Promise.reject(error.message);
  },
);

export default axiosInstance;
