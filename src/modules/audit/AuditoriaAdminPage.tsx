import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditoriaApi } from '../../api/auditoria.api';
import { useForm } from 'react-hook-form';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import { formatDate, transaccionEstadoLabel } from '../../shared/utils/format';
import { ClipboardList, Search, X } from 'lucide-react';
import type { AuditoriaFiltros, AuditoriaResponseDTO } from '../../types/auditoria';
import { ESTADOS } from '../../types/transaccion';

export default function AuditoriaAdminPage() {
  const [filtros, setFiltros] = useState<AuditoriaFiltros>({});

  const { data, isLoading } = useQuery({
    queryKey: ['auditoria', filtros],
    queryFn: () => auditoriaApi.listar(filtros)
  });

  const { register, handleSubmit, reset } = useForm<AuditoriaFiltros>();

  // CORRECCIÓN DE EXTRACCIÓN: Contempla si tu apiClient devuelve el array directo o envuelto en Axios
  const datosCrudos = (data as any)?.data ?? data;
  const lista: AuditoriaResponseDTO[] = Array.isArray(datosCrudos)
    ? datosCrudos
    : datosCrudos?.content ?? [];

  // Volvemos a tus filtros originales en camelCase (sin snake_case)
  const onBuscar = handleSubmit((vals) => {
    const clean = Object.fromEntries(
      Object.entries(vals).filter(([, v]) => {
        if (v === '' || v === undefined || v === null) return false;
        if (typeof v === 'number' && Number.isNaN(v)) return false;
        return true;
      })
    ) as AuditoriaFiltros;

    setFiltros(clean);
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="admin-page-title">Auditoría</h1>
        <p className="text-slate-500 text-sm mt-1">Trazabilidad de cambios en el sistema</p>
      </div>

      {/* Filtros */}
      <div className="card-admin p-5 mb-6">
        <form onSubmit={onBuscar} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="label-admin">Transacción ID</label><input {...register('transaccionId', { valueAsNumber: true })} type="number" className="input-admin" placeholder="Opcional" /></div>
          <div><label className="label-admin">Vendedor ID</label><input {...register('vendedorId', { valueAsNumber: true })} type="number" className="input-admin" placeholder="Opcional" /></div>
          <div>
            <label className="label-admin">Estado anterior</label>
            <select {...register('estadoAnterior')} className="input-admin">
              <option value="">— Todos —</option>
              {ESTADOS.map(e => <option key={e} value={e}>{transaccionEstadoLabel[e]}</option>)}
            </select>
          </div>
          <div>
            <label className="label-admin">Estado nuevo</label>
            <select {...register('estadoNuevo')} className="input-admin">
              <option value="">— Todos —</option>
              {ESTADOS.map(e => <option key={e} value={e}>{transaccionEstadoLabel[e]}</option>)}
            </select>
          </div>
          <div><label className="label-admin">Fecha desde</label><input {...register('fechaDesde')} type="date" className="input-admin" /></div>
          <div><label className="label-admin">Fecha hasta</label><input {...register('fechaHasta')} type="date" className="input-admin" /></div>
          <div className="col-span-2 flex items-end gap-3">
            {/* CORRECCIÓN: Se removió el onClick={onBuscar} de aquí */}
            <button type="submit" className="btn-admin-primary flex items-center gap-2"><Search size={14} /> Buscar</button>
            <button type="button" onClick={() => { reset(); setFiltros({}); }} className="btn-admin-secondary flex items-center gap-1"><X size={14} /> Limpiar</button>
          </div>
        </form>
      </div>

      {isLoading ? <Spinner size={36} className="py-16" /> : lista.length === 0 ? (
        <EmptyState icon={<ClipboardList size={48} />} title="Sin registros de auditoría" description="No hay cambios que coincidan con los filtros." />
      ) : (
        <div className="card-admin overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>{['ID', 'Transacción', 'Vendedor', 'Estado anterior', 'Estado nuevo', 'Precio ant.', 'Precio nuevo', 'Fecha'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-xs">{a.id}</td>
                  <td className="px-4 py-3 font-semibold">{a.transaccion_id}</td>
                  <td className="px-4 py-3 font-semibold">{a.vendedor_id}</td>
                  <td className="px-4 py-3">
                    {a.estadoAnterior ? <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{transaccionEstadoLabel[a.estadoAnterior] ?? a.estadoAnterior}</span> : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {a.estadoNuevo ? <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{transaccionEstadoLabel[a.estadoNuevo] ?? a.estadoNuevo}</span> : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {a.precioFinalAnterior ? `$${Number(a.precioFinalAnterior).toLocaleString('es-AR')}` : '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {a.precioFinalNuevo ? `$${Number(a.precioFinalNuevo).toLocaleString('es-AR')}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{a.created_at ? formatDate(a.created_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
