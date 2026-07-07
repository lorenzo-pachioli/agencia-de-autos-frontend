import { apiClient, publicApiClient } from './client';

export const modelosApi = {
  listar: () => publicApiClient.get('/modelos'),
  obtener: (id: number) => publicApiClient.get(`/modelos/${id}`),
  crear: (data: unknown) => apiClient.post('/modelos', data),
  actualizar: (id: number, data: unknown) => apiClient.put(`/modelos/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/modelos/${id}`),
};
