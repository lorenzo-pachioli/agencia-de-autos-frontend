import { apiClient } from './client';
import type { TransaccionCrearDTO, TransaccionFiltros } from '../types/transaccion';

export const transaccionesApi = {
  listar: (filtros?: TransaccionFiltros) => apiClient.get('/transacciones', { params: filtros }),
  obtener: (id: number) => apiClient.get(`/transacciones/${id}`),
  crear: (data: TransaccionCrearDTO) => apiClient.post('/transacciones', data),
  actualizar: (id: number, data: unknown) => apiClient.put(`/transacciones/${id}`, data),
  cambiarEstado: (id: number, estado: string) => apiClient.patch(`/transacciones/${id}/estado`, { estado }),
  seniar: (id: number, data: unknown) => apiClient.patch(`/transacciones/${id}/seniar`, data),
  vender: (id: number, data: unknown) => apiClient.patch(`/transacciones/${id}/vender`, data),
  cancelar: (id: number) => apiClient.patch(`/transacciones/${id}/cancelar`),
  comisionVendedor: (
    vendedorId: number,
    fechaDesde: string,
    fechaHasta: string
  ) =>
    apiClient.get(
      `/transacciones/comision-vendedor/${vendedorId}`,
      {
        params: {
          fechaDesde,
          fechaHasta,
        },
      }
    ),
  rendimiento: (fechaDesde: string, fechaHasta: string) => apiClient.get('/transacciones/rendimiento', { params: { fechaDesde, fechaHasta } }),
};
