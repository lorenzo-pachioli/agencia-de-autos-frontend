import { publicApiClient } from './client';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export const authApi = {
  login: (data: LoginRequest) => publicApiClient.post('/auth/login', data),
  register: (data: RegisterRequest) => publicApiClient.post('/auth/register', data),
};
