import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://back-end-theta-ashen.vercel.app/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth tokens to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth.token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth.token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;