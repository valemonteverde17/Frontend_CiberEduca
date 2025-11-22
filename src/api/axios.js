import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
        // Si el token expiró o es inválido, podríamos limpiar el storage y redirigir
        // Pero eso es mejor manejarlo en el contexto o componente para no causar loops
        // Por ahora solo rechazamos el error.
    }
    return Promise.reject(error);
  }
);

export default api;