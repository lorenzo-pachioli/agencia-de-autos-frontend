import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES, type AuthUser, type Rol } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, userData?: Partial<AuthUser>) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (token: string, userData?: Partial<AuthUser>) => {
        const claims = parseJwt(token);
        const rol = (claims.rol ?? claims.role ?? claims.authorities ?? ROLES.CLIENTE) as Rol;
        const email = (claims.sub ?? claims.email ?? userData?.email ?? '') as string;
        const user: AuthUser = {
          token,
          email,
          rol,
          id: userData?.id ?? (claims.id as number | undefined),
          nombre: userData?.nombre ?? (claims.nombre as string | undefined),
          apellido: userData?.apellido ?? (claims.apellido as string | undefined),
        };
        set({ user, isAuthenticated: true });
        // Also persist token in the legacy config key so apiClient interceptor picks it up
        const existing = JSON.parse(localStorage.getItem('agencia_api_config') ?? '{}');
        localStorage.setItem('agencia_api_config', JSON.stringify({ ...existing, token }));
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        const existing = JSON.parse(localStorage.getItem('agencia_api_config') ?? '{}');
        localStorage.setItem('agencia_api_config', JSON.stringify({ ...existing, token: '' }));
      },

      updateUser: (data) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...data } });
      },
    }),
    { name: 'agencia_auth' }
  )
);

// Role helpers
export const useIsAdmin = () => useAuthStore(s => s.user?.rol === ROLES.ADMINISTRADOR);
export const useIsVendedor = () => useAuthStore(s => s.user?.rol === ROLES.VENDEDOR || s.user?.rol === ROLES.ADMINISTRADOR);
export const useIsCliente = () => useAuthStore(s => s.user?.rol === ROLES.CLIENTE);
export const useCanManage = () => useAuthStore(s => s.user?.rol === ROLES.VENDEDOR || s.user?.rol === ROLES.ADMINISTRADOR);
