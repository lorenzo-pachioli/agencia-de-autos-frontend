import { apiClient } from './client';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post('/auth/register', data),
};
