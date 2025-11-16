import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  // Puedes agregar más configs aquí si quieres (headers, timeouts, etc.)
});

export default api;