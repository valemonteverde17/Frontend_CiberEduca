import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000', // Cambia si tu API usa otro puerto
});
