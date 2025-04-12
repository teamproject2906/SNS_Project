import axios from 'axios';
import { getToken, setToken } from './static'; 

const api = axios.create({
  baseURL: 'http://localhost:8080', // Base URL chung
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && typeof token === 'string' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setToken(null);
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!'));
    }
    return Promise.reject(error);
  }
);

export default api;