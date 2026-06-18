import { useQuery } from '@tanstack/react-query';
import { auditoriaApi } from '../../api/auditoria.api';
import type { AuditoriaFiltros } from '../../types/auditoria';

export const useAuditoria = (
    filtros?: AuditoriaFiltros
) =>
    useQuery({
        queryKey: [
            'auditoria',
            filtros,
        ],
        queryFn: () =>
            auditoriaApi
                .listar(filtros)
                .then(r => r.data),
    });

export const useCambiosEstado = (
    fechaDesde?: string,
    fechaHasta?: string
) =>
    useQuery({
        queryKey: [
            'auditoria',
            'cambio-estado',
            fechaDesde,
            fechaHasta,
        ],
        queryFn: () =>
            auditoriaApi
                .cambiosEstado(
                    fechaDesde,
                    fechaHasta
                )
                .then(r => r.data),
    });

export const useCambiosPrecio = (
    fechaDesde?: string,
    fechaHasta?: string
) =>
    useQuery({
        queryKey: [
            'auditoria',
            'cambio-precio',
            fechaDesde,
            fechaHasta,
        ],
        queryFn: () =>
            auditoriaApi
                .cambiosPrecio(
                    fechaDesde,
                    fechaHasta
                )
                .then(r => r.data),
    });