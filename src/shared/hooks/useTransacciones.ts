import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transaccionesApi } from '../../api/transacciones.api';
import type { TransaccionCrearDTO, TransaccionFiltros } from '../../types/transaccion';
import { toast } from 'sonner';

export const useTransacciones = (filtros?: TransaccionFiltros) =>
  useQuery({
    queryKey: ['transacciones', filtros], queryFn: () => transaccionesApi.listar(filtros).then(r => {
      return r.data;
    })
  });

export const useTransaccion = (id: number) =>
  useQuery({ queryKey: ['transacciones', id], queryFn: () => transaccionesApi.obtener(id).then(r => r.data), enabled: id > 0 });

export const useTransaccionesMutation = () => {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ['transacciones'] });

  const crear = useMutation({ mutationFn: (d: TransaccionCrearDTO) => transaccionesApi.crear(d), onSuccess: () => { toast.success('Transacción creada'); inv(); }, onError: () => toast.error('Error al crear') });
  const seniar = useMutation({ mutationFn: ({ id, d }: { id: number; d: unknown }) => transaccionesApi.seniar(id, d), onSuccess: () => { toast.success('Seña registrada'); inv(); }, onError: () => toast.error('Error') });
  const vender = useMutation({ mutationFn: ({ id, d }: { id: number; d: unknown }) => transaccionesApi.vender(id, d), onSuccess: () => { toast.success('Venta confirmada'); inv(); }, onError: () => toast.error('Error') });
  const cancelar = useMutation({ mutationFn: (id: number) => transaccionesApi.cancelar(id), onSuccess: () => { toast.success('Transacción cancelada'); inv(); }, onError: () => toast.error('Error') });

  return { crear, seniar, vender, cancelar };
};
