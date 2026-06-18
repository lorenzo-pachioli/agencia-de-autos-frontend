export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { nombre: string; apellido: string; email: string; password: string; }
export interface AuthResponse { token: string; email?: string; rol?: string; }

export type Rol = 'ROLE_CLIENTE' | 'ROLE_VENDEDOR' | 'ROLE_ADMINISTRADOR';

export const ROLES: Record<string, Rol> = {
    CLIENTE: 'ROLE_CLIENTE',
    VENDEDOR: 'ROLE_VENDEDOR',
    ADMINISTRADOR: 'ROLE_ADMINISTRADOR'
};

export interface AuthUser {
    id?: number;
    nombre?: string;
    apellido?: string;
    email: string;
    rol: Rol;
    token: string;
}