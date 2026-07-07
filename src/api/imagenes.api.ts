import { apiClient, publicApiClient } from './client';
import type { CreateImagenRequest } from '../types/imagen';

export const imagenesApi = {
  listar: () => publicApiClient.get('/imagenes'),
  obtener: (id: number) => publicApiClient.get(`/imagenes/${id}`),
  obtenerPorVehiculo: (vehiculoId: number) => publicApiClient.get(`/imagenes/vehiculo/${vehiculoId}`),
  crear: (data: CreateImagenRequest) => apiClient.post('/imagenes', data),
  actualizar: (id: number, data: CreateImagenRequest) => apiClient.put(`/imagenes/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/imagenes/${id}`),
};
