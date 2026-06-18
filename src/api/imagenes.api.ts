import { apiClient } from './client';
import type { CreateImagenRequest } from '../types/imagen';

export const imagenesApi = {
  listar: () => apiClient.get('/imagenes'),
  obtener: (id: number) => apiClient.get(`/imagenes/${id}`),
  obtenerPorVehiculo: (vehiculoId: number) => apiClient.get(`/imagenes/vehiculo/${vehiculoId}`),
  crear: (data: CreateImagenRequest) => apiClient.post('/imagenes', data),
  actualizar: (id: number, data: CreateImagenRequest) => apiClient.put(`/imagenes/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/imagenes/${id}`),
};
