import { apiClient } from './client';
import type { AuditoriaFiltros, AuditoriaResponseDTO } from '../types/auditoria';

export const auditoriaApi = {
  porTransaccion: (id: number) => apiClient.get(`/auditoria/transaccion/${id}`),
  porVendedor: (id: number) => apiClient.get(`/auditoria/vendedor/${id}`),
  listar: (filtros?: AuditoriaFiltros): Promise<AuditoriaResponseDTO[]> =>
    apiClient.get('/auditoria', { params: filtros }),

  cambiosEstado: (
    fechaDesde?: string,
    fechaHasta?: string
  ) =>
    apiClient.get('/auditoria/cambio-estado', {
      params: {
        fechaDesde,
        fechaHasta,
      },
    }),

  cambiosPrecio: (
    fechaDesde?: string,
    fechaHasta?: string
  ) =>
    apiClient.get('/auditoria/cambio-precio', {
      params: {
        fechaDesde,
        fechaHasta,
      },
    }),
};
