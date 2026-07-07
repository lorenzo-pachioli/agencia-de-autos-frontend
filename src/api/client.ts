import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const publicApiClient = axios.create({ baseURL: BASE_URL });

export const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
  const auth = localStorage.getItem('agencia_auth');
  const token = auth ? (() => {
    try {
      return JSON.parse(auth)?.state?.user?.token ?? null;
    } catch {
      return null;
    }
  })() : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 403) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
