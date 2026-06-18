import { apiClient } from './client';
import type { VehiculoFiltros } from '../types/vehiculo';

export const vehiculosApi = {
  listar: () => apiClient.get('/vehiculos'),
  obtener: (id: number) => apiClient.get(`/vehiculos/${id}`),
  crear: (data: unknown) => apiClient.post('/vehiculos', data),
  actualizar: (id: number, data: unknown) => apiClient.put(`/vehiculos/${id}`, data),
  eliminar: (id: number) => apiClient.delete(`/vehiculos/${id}`),
  busqueda: (filtros: VehiculoFiltros) => apiClient.get('/vehiculos/busqueda', { params: filtros }),
  cambiarEstado: (id: number, estado: string) => apiClient.patch(`/vehiculos/${id}/estado`, { estado }),
  reporteStock: () => apiClient.get('/vehiculos/reportes/stock'),
  reporteUltimos: () => apiClient.get('/vehiculos/reportes/ultimos'),
};
