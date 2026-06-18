import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modelosApi } from '../../api/modelos.api';
import { toast } from 'sonner';

export const useModelos = () =>
  useQuery({ queryKey: ['modelos'], queryFn: () => modelosApi.listar().then(r => r.data) });

export const useModelosMutation = () => {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ['modelos'] });
  const crear = useMutation({ mutationFn: (d: unknown) => modelosApi.crear(d), onSuccess: () => { toast.success('Modelo creado'); inv(); }, onError: () => toast.error('Error') });
  const actualizar = useMutation({ mutationFn: ({ id, d }: { id: number; d: unknown }) => modelosApi.actualizar(id, d), onSuccess: () => { toast.success('Modelo actualizado'); inv(); }, onError: () => toast.error('Error') });
  const eliminar = useMutation({ mutationFn: (id: number) => modelosApi.eliminar(id), onSuccess: () => { toast.success('Modelo eliminado'); inv(); }, onError: () => toast.error('Error') });
  return { crear, actualizar, eliminar };
};
