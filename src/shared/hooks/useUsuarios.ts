import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '../../api/usuarios.api';
import { toast } from 'sonner';

export const useUsuarios = () =>
  useQuery({ queryKey: ['usuarios'], queryFn: () => usuariosApi.listar().then(r => r.data) });

export const useUsuario = (id: number) =>
  useQuery({ queryKey: ['usuarios', id], queryFn: () => usuariosApi.obtener(id).then(r => r.data), enabled: id > 0 });

export const useUsuariosMutation = () => {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ['usuarios'] });
  const actualizar = useMutation({ mutationFn: ({ id, d }: { id: number; d: unknown }) => usuariosApi.actualizar(id, d), onSuccess: () => { toast.success('Usuario actualizado'); inv(); }, onError: () => toast.error('Error') });
  const darBaja = useMutation({ mutationFn: (id: number) => usuariosApi.darBaja(id), onSuccess: () => { toast.success('Usuario dado de baja'); inv(); }, onError: () => toast.error('Error') });
  const crearVendedor = useMutation({ mutationFn: (d: unknown) => usuariosApi.crearVendedor(d), onSuccess: () => { toast.success('Vendedor creado'); inv(); }, onError: () => toast.error('Error') });
  return { actualizar, darBaja, crearVendedor };
};
