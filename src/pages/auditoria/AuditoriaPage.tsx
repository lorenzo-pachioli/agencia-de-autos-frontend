import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auditoriaApi } from '../../api/auditoria.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import type { AuditoriaFiltros, AuditoriaResponseDTO } from '../../types/auditoria';
import { Loader2, X } from 'lucide-react';
import { ESTADOS } from '../../types/transaccion';

export default function AuditoriaPage() {
  const [auditorias, setAuditorias] = useState<AuditoriaResponseDTO[]>([]);
  const listarLog = useRequestLog();
  const transaccionLog = useRequestLog();
  const vendedorLog = useRequestLog();
  const estadosLog = useRequestLog();
  const preciosLog = useRequestLog();

  const filtrosForm = useForm<AuditoriaFiltros>();
  const transaccionForm = useForm({ defaultValues: { id: 0 } });
  const vendedorForm = useForm({ defaultValues: { id: 0 } });

  const handleListar = filtrosForm.handleSubmit(async (data) => {
    const clean = Object.fromEntries(
      Object.entries(data).filter(
        ([, v]) => v !== '' && v !== undefined && v !== null
      )
    ) as AuditoriaFiltros;

    const res = await listarLog.execute(
      'GET',
      '/auditoria',
      clean,
      () => auditoriaApi.listar(clean)
    );

    if (Array.isArray(res)) {
      setAuditorias(res);
    }
  });

  return (
    <div>
      <PageHeader title="Auditoría" subtitle="Trazabilidad de cambios en transacciones." badge="5 endpoints" />
      <div className="space-y-4 max-w-2xl">

        {/* Auditoría general con filtros */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/auditoria</code></div>
            <div className="flex gap-2">
              <button onClick={() => { filtrosForm.reset(); setAuditorias([]); }} className="btn-secondary flex items-center gap-1 text-xs py-1.5">
                <X size={12} /> Limpiar
              </button>
              <button onClick={handleListar} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
                {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
              </button>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div><label className="label">Transacción ID</label><input {...filtrosForm.register('transaccionId', { valueAsNumber: true })} type="number" className="input" placeholder="Opcional" /></div>
            <div><label className="label">Vendedor ID</label><input {...filtrosForm.register('vendedorId', { valueAsNumber: true })} type="number" className="input" placeholder="Opcional" /></div>
            <div>
              <label className="label">Estado anterior</label>
              <select {...filtrosForm.register('estadoAnterior')} className="input">
                <option value="">— Todos —</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estado nuevo</label>
              <select {...filtrosForm.register('estadoNuevo')} className="input">
                <option value="">— Todos —</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div><label className="label">Fecha desde</label><input {...filtrosForm.register('fechaDesde')} type="date" className="input" /></div>
            <div><label className="label">Fecha hasta</label><input {...filtrosForm.register('fechaHasta')} type="date" className="input" /></div>
            <div><label className="label">Página</label><input {...filtrosForm.register('page', { valueAsNumber: true })} type="number" className="input" placeholder="0" /></div>
            <div><label className="label">Tamaño</label><input {...filtrosForm.register('size', { valueAsNumber: true })} type="number" className="input" placeholder="10" /></div>
            <div className="col-span-2"><label className="label">Sort</label><input {...filtrosForm.register('sort')} className="input" placeholder="fechaCambio,desc" /></div>
          </div>
          {auditorias.length > 0 && (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'transaccionId', label: 'Transacción' },
                { key: 'estadoAnterior', label: 'Estado Ant.' },
                { key: 'estadoNuevo', label: 'Estado Nuevo' },
                { key: 'precioAnterior', label: 'Precio Ant.', render: r => r.precioAnterior ? `$${Number(r.precioAnterior).toLocaleString()}` : '—' },
                { key: 'fechaCambio', label: 'Fecha', render: r => r.fechaCambio ? String(r.fechaCambio).slice(0, 10) : '—' },
              ]}
              data={auditorias as unknown as Record<string, unknown>[]}
            />
          )}
          <ApiResponseCard log={listarLog.log} />
        </div>

        {/* Por transacción */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/auditoria/transaccion/{'{id}'}</code></div>
            <button onClick={transaccionForm.handleSubmit(({ id }) =>
              transaccionLog.execute('GET', `/auditoria/transaccion/${id}`, undefined, () => auditoriaApi.porTransaccion(id))
            )} disabled={transaccionLog.loading} className="btn-primary flex items-center gap-2">
              {transaccionLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID de transacción</label>
            <input {...transaccionForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={transaccionLog.log} />
        </div>

        {/* Por vendedor */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/auditoria/vendedor/{'{id}'}</code></div>
            <button onClick={vendedorForm.handleSubmit(({ id }) =>
              vendedorLog.execute('GET', `/auditoria/vendedor/${id}`, undefined, () => auditoriaApi.porVendedor(id))
            )} disabled={vendedorLog.loading} className="btn-primary flex items-center gap-2">
              {vendedorLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID de vendedor</label>
            <input {...vendedorForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={vendedorLog.log} />
        </div>

        {/* Cambios de estado */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/auditoria/cambio-estado</code></div>
            <button onClick={() => estadosLog.execute('GET', '/auditoria/cambio-estado', undefined, () => auditoriaApi.cambiosEstado())}
              disabled={estadosLog.loading} className="btn-primary flex items-center gap-2">
              {estadosLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <ApiResponseCard log={estadosLog.log} />
        </div>

        {/* Cambios de precio */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/auditoria/cambio-precio</code></div>
            <button onClick={() => preciosLog.execute('GET', '/auditoria/cambio-precio', undefined, () => auditoriaApi.cambiosPrecio())}
              disabled={preciosLog.loading} className="btn-primary flex items-center gap-2">
              {preciosLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <ApiResponseCard log={preciosLog.log} />
        </div>

      </div>
    </div>
  );
}
