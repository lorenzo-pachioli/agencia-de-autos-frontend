import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marcasApi } from '../../api/marcas.api';
import { toast } from 'sonner';

export const useMarcas = () =>
  useQuery({ queryKey: ['marcas'], queryFn: () => marcasApi.listar().then(r => r.data) });

export const useMarcasMutation = () => {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ['marcas'] });
  const crear = useMutation({ mutationFn: (d: unknown) => marcasApi.crear(d), onSuccess: () => { toast.success('Marca creada'); inv(); }, onError: () => toast.error('Error') });
  const actualizar = useMutation({ mutationFn: ({ id, d }: { id: number; d: unknown }) => marcasApi.actualizar(id, d), onSuccess: () => { toast.success('Marca actualizada'); inv(); }, onError: () => toast.error('Error') });
  const eliminar = useMutation({ mutationFn: (id: number) => marcasApi.eliminar(id), onSuccess: () => { toast.success('Marca eliminada'); inv(); }, onError: () => toast.error('Error') });
  return { crear, actualizar, eliminar };
};
