import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Agregar token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Token expirado o inválido
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Solo redirigir si no estamos ya en login o signup
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
      }
      
      // Sin permisos
      if (error.response.status === 403) {
        console.error('No tienes permisos para realizar esta acción');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;