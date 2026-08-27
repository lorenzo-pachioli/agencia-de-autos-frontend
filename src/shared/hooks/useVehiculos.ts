import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { vehiculosApi } from '../../api/vehiculos.api';
import type { VehiculoFiltros } from '../../types/vehiculo';
import { toast } from 'sonner';

export const useVehiculosBusqueda = (filtros: VehiculoFiltros) =>
  useQuery({
    queryKey: ['vehiculos', 'busqueda', filtros],
    queryFn: () => vehiculosApi.busqueda(filtros).then(r => r.data),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });

export const useVehiculo = (id: number) =>
  useQuery({
    queryKey: ['vehiculos', id],
    queryFn: () => vehiculosApi.obtener(id).then(r => r.data),
    enabled: id > 0,
  });

export const useVehiculosMutation = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['vehiculos'] });

  const crear = useMutation({
    mutationFn: (data: unknown) => vehiculosApi.crear(data),
    onSuccess: () => { toast.success('Vehículo creado'); invalidate(); },
    onError: () => toast.error('Error al crear vehículo'),
  });

  const actualizar = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => vehiculosApi.actualizar(id, data),
    onSuccess: () => { toast.success('Vehículo actualizado'); invalidate(); },
    onError: () => toast.error('Error al actualizar'),
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => vehiculosApi.eliminar(id),
    onSuccess: () => { toast.success('Vehículo eliminado'); invalidate(); },
    onError: () => toast.error('Error al eliminar'),
  });

  const cambiarEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) => vehiculosApi.cambiarEstado(id, estado),
    onSuccess: () => { toast.success('Estado actualizado'); invalidate(); },
    onError: () => toast.error('Error al cambiar estado'),
  });

  return { crear, actualizar, eliminar, cambiarEstado };
};

export const useReporteUltimos = () =>
  useQuery({ queryKey: ['reportes', 'ultimos'], queryFn: () => vehiculosApi.reporteUltimos().then(r => r.data) });

export const useReporteStock = () =>
  useQuery({ queryKey: ['reportes', 'stock'], queryFn: () => vehiculosApi.reporteStock().then(r => r.data) });

