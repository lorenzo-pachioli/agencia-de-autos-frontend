import { apiClient } from './client';

export const modelosApi = {
  listar: () => apiClient.get('/modelos'),
  obtener: (id: number) => apiClient.get(`/modelos/${id}`),
  crear: (data: unknown) => apiClient.post('/modelos', data),
  actualizar: (id: number, data: unknown) => apiClient.put(`/modelos/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/modelos/${id}`),
};
