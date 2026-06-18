import { apiClient } from './client';

export const favoritosApi = {
  listar: () => apiClient.get('/favoritos'),
  agregar: (vehiculoId: number) => apiClient.post(`/favoritos/agregar/${vehiculoId}`),
  eliminar: (vehiculoId: number) => apiClient.delete(`/favoritos/eliminar/${vehiculoId}`),
};
