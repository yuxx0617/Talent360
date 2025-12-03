import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { authService } from './auth';

const api: AxiosInstance = axios.create({
  baseURL: 'https://localhost:7204/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：自動附加 JWT token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器：處理認證錯誤
api.interceptors.response.use(
  (response) => response,
  (error: Error & { response?: { status: number } }) => {
    if (error.response?.status === 401) {
      authService.removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
