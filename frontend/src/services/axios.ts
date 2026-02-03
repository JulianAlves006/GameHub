import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Evita múltiplos toasts de erro
      const lastError = localStorage.getItem('lastErrorTime');
      const now = Date.now();

      if (!lastError || now - parseInt(lastError) > 2000) {
        toast.error('Você precisa logar novamente para essa requisição');
        localStorage.setItem('lastErrorTime', now.toString());
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
