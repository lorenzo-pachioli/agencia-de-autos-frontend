export interface Usuario {
  id: number; nombre: string; apellido: string;
  email: string; rolUsuario: string; activo: boolean;
}
export interface CreateVendedorRequest {
  nombre: string; apellido: string; email: string; password: string;
}
export interface UpdateUsuarioRequest {
  nombre?: string; apellido?: string; email?: string;
}
