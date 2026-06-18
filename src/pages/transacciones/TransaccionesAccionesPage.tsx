import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { transaccionesApi } from '../../api/transacciones.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import { Loader2 } from 'lucide-react';
import { ESTADOS } from '../../types/transaccion';
import { useState } from 'react';
import { obtenerFechaHace30Dias, obtenerFechaHoy } from '../../shared/utils/format';

export default function TransaccionesAccionesPage() {
  const estadoLog = useRequestLog();
  const seniarLog = useRequestLog();
  const venderLog = useRequestLog();
  const cancelarLog = useRequestLog();
  const comisionLog = useRequestLog();
  const rendimientoLog = useRequestLog();
  const [fechaDesde, setFechaDesde] = useState(obtenerFechaHace30Dias());
  const [fechaHasta, setFechaHasta] = useState(obtenerFechaHoy());

  const estadoForm = useForm({ defaultValues: { id: 0, estado: '' } });
  const seniarForm = useForm({ defaultValues: { id: 0, montoSenia: 0 } });
  const venderForm = useForm({ defaultValues: { id: 0, precioVenta: 0 } });
  const cancelarForm = useForm({ defaultValues: { id: 0 } });
  const comisionForm = useForm({ defaultValues: { vendedorId: 0 } });

  return (
    <div>
      <PageHeader title="Acciones de Transacciones" subtitle="Operaciones de cambio de estado y reportes financieros." badge="6 endpoints" />
      <div className="space-y-4 max-w-2xl">

        {/* Cambiar estado */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-patch">PATCH</span><code className="text-sm font-mono text-slate-700">/transacciones/{'{id}'}/estado</code></div>
            <button onClick={estadoForm.handleSubmit(async ({ id, estado }) => {
              await estadoLog.execute('PATCH', `/transacciones/${id}/estado`, { estado }, () => transaccionesApi.cambiarEstado(id, estado));
              toast.success('Estado actualizado');
            })} disabled={estadoLog.loading} className="btn-primary flex items-center gap-2">
              {estadoLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div><label className="label">ID</label><input {...estadoForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div>
              <label className="label">Nuevo estado</label>
              <select {...estadoForm.register('estado')} className="input">
                <option value="">— Seleccionar —</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <ApiResponseCard log={estadoLog.log} />
        </div>

        {/* Señar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-patch">PATCH</span><code className="text-sm font-mono text-slate-700">/transacciones/{'{id}'}/seniar</code></div>
            <button onClick={seniarForm.handleSubmit(async ({ id, montoSenia }) => {
              const payload = { montoSenia };
              await seniarLog.execute('PATCH', `/transacciones/${id}/seniar`, payload, () => transaccionesApi.seniar(id, payload));
              toast.success('Seña registrada');
            })} disabled={seniarLog.loading} className="btn-primary flex items-center gap-2">
              {seniarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div><label className="label">ID de transacción</label><input {...seniarForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Monto de seña</label><input {...seniarForm.register('montoSenia', { valueAsNumber: true })} type="number" className="input" placeholder="50000" /></div>
          </div>
          <ApiResponseCard log={seniarLog.log} />
        </div>

        {/* Vender */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-patch">PATCH</span><code className="text-sm font-mono text-slate-700">/transacciones/{'{id}'}/vender</code></div>
            <button onClick={venderForm.handleSubmit(async ({ id, precioVenta }) => {
              const payload = { precioVenta };
              await venderLog.execute('PATCH', `/transacciones/${id}/vender`, payload, () => transaccionesApi.vender(id, payload));
              toast.success('Venta confirmada');
            })} disabled={venderLog.loading} className="btn-primary flex items-center gap-2">
              {venderLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div><label className="label">ID de transacción</label><input {...venderForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Precio de venta</label><input {...venderForm.register('precioVenta', { valueAsNumber: true })} type="number" className="input" placeholder="500000" /></div>
          </div>
          <ApiResponseCard log={venderLog.log} />
        </div>

        {/* Cancelar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-patch">PATCH</span><code className="text-sm font-mono text-slate-700">/transacciones/{'{id}'}/cancelar</code></div>
            <button onClick={cancelarForm.handleSubmit(async ({ id }) => {
              await cancelarLog.execute('PATCH', `/transacciones/${id}/cancelar`, undefined, () => transaccionesApi.cancelar(id));
              toast.success('Transacción cancelada');
            })} disabled={cancelarLog.loading} className="btn-danger flex items-center gap-2">
              {cancelarLog.loading && <Loader2 size={14} className="animate-spin" />} Cancelar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID de transacción</label>
            <input {...cancelarForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={cancelarLog.log} />
        </div>

        {/* Comisión vendedor */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/transacciones/comision-vendedor/{'{vendedorId}'}</code></div>
            <button onClick={comisionForm.handleSubmit(async ({ vendedorId }) => {
              await comisionLog.execute('GET', `/transacciones/comision-vendedor/${vendedorId}`, undefined, () => transaccionesApi.comisionVendedor(vendedorId, fechaDesde, fechaHasta));
            })} disabled={comisionLog.loading} className="btn-primary flex items-center gap-2">
              {comisionLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">Vendedor ID</label>
            <input {...comisionForm.register('vendedorId', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={comisionLog.log} />
        </div>

        {/* Rendimiento */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/transacciones/rendimiento</code></div>
            {/* filtros de fechas */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-xs font-medium">Desde:</span>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-xs font-medium">Hasta:</span>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>
              {/* Botón opcional para limpiar fechas rápidamente */}
              {(fechaDesde || fechaHasta) && (
                <button
                  onClick={() => { setFechaDesde(''); setFechaHasta(''); }}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>
            <button onClick={() => rendimientoLog.execute('GET', '/transacciones/rendimiento', undefined, () => transaccionesApi.rendimiento(fechaDesde, fechaHasta))}
              disabled={rendimientoLog.loading} className="btn-primary flex items-center gap-2">
              {rendimientoLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <ApiResponseCard log={rendimientoLog.log} />
        </div>

      </div>
    </div>
  );
}
