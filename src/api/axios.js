import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',   // Usa la variable de entorno o el proxy de Vite por defecto
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de request: si hay un token en localStorage,
 * lo adjunta automáticamente en el header Authorization.
 * Así no tienes que pasarlo manualmente en cada llamada.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de response: si el backend responde con 401 (token expirado)
 * limpia el token y redirige al login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);