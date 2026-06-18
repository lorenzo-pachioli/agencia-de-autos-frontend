import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritosApi } from '../../api/favoritos.api';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';

export const useFavoritos = () => {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: ['favoritos'],
    queryFn: () => favoritosApi.listar().then(r => r.data),
    enabled: isAuth,
  });
};

export const useFavoritosMutation = () => {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ['favoritos'] });
  const agregar = useMutation({
    mutationFn: (id: number) => favoritosApi.agregar(id),
    onSuccess: () => { toast.success('Agregado a favoritos'); inv(); },
  });
  const eliminar = useMutation({
    mutationFn: (id: number) => favoritosApi.eliminar(id),
    onSuccess: () => { toast.success('Eliminado de favoritos'); inv(); },
  });
  return { agregar, eliminar };
};
