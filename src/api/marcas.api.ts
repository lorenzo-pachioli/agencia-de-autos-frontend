import { apiClient, publicApiClient } from './client';

export const marcasApi = {
  listar: () => publicApiClient.get('/marcas'),
  obtener: (id: number) => publicApiClient.get(`/marcas/${id}`),
  crear: (data: unknown) => apiClient.post('/marcas', data),
  actualizar: (id: number, data: unknown) => apiClient.put(`/marcas/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/marcas/${id}`),
};
