import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 
  JSON.parse(localStorage.getItem('agencia_api_config') ?? '{}').baseUrl ?? 
  'http://localhost:8080';

export const apiClient = axios.create({ baseURL: BASE_URL });

// Dynamic base URL + token injection
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('agencia_api_config');
  const cfg = raw ? JSON.parse(raw) : {};
  if (cfg.baseUrl) config.baseURL = cfg.baseUrl;
  
  const auth = localStorage.getItem('agencia_auth');
  const token = auth ? JSON.parse(auth)?.state?.user?.token : cfg.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('agencia_auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
