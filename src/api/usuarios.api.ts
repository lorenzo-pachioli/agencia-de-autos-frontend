import { apiClient } from './client';

export const usuariosApi = {
  listar: () => apiClient.get('/usuarios'),
  obtener: (id: number) => apiClient.get(`/usuarios/${id}`),
  actualizar: (id: number, data: unknown) => apiClient.put(`/usuarios/${id}`, data),
  darBaja: (id: number) => apiClient.patch(`/usuarios/${id}`, {}),
  crearVendedor: (data: unknown) => apiClient.post('/usuarios/vendedores', data),
};
