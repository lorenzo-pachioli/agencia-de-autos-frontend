import { apiClient } from './client';

export const marcasApi = {
  listar: () => apiClient.get('/marcas'),
  obtener: (id: number) => apiClient.get(`/marcas/${id}`),
  crear: (data: unknown) => apiClient.post('/marcas', data),
  actualizar: (id: number, data: unknown) => apiClient.put(`/marcas/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/marcas/${id}`),
};
