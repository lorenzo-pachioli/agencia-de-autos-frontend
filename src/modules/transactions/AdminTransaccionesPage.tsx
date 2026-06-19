import { useState } from 'react';
import { useTransacciones, useTransaccionesMutation } from '../../shared/hooks/useTransacciones';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import { formatPrice, transaccionEstadoLabel, transaccionEstadoBadge, obtenerFechaHace30Dias, obtenerFechaHoy } from '../../shared/utils/format';
import { useForm } from 'react-hook-form';
import { Plus, ReceiptText } from 'lucide-react';
import { type Transaccion, type TransaccionCrearDTO, ESTADOS, MetodoPago } from '../../types/transaccion';
import type { EstadoTransaccion } from '../../types/transaccion';

export default function AdminTransaccionesPage() {
  const { data, isLoading } = useTransacciones();
  const { crear, seniar, vender, cancelar } = useTransaccionesMutation();
  const [modalCrear, setModalCrear] = useState(false);
  const [accion, setAccion] = useState<{ tipo: 'seniar' | 'vender' | 'cancelar'; t: Transaccion } | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [fechaDesde, setFechaDesde] = useState(obtenerFechaHace30Dias());
  const [fechaHasta, setFechaHasta] = useState(obtenerFechaHoy());

  const lista: Transaccion[] = Array.isArray(data) ? data : data?.content ?? [];
  const filtrada = filtroEstado ? lista.filter(t => t.estadoTransaccion === filtroEstado) : lista;

  const crearForm = useForm<TransaccionCrearDTO>({
    defaultValues: {
      vehiculo_id: 0, cliente_id: 0, vendedor_id: 0, precio_final: 0, estadoTransaccion: 'RESERVA', metodoPago: 'EFECTIVO', observaciones: ''
    }
  });
  const accionForm = useForm<{ monto: number }>({ defaultValues: { monto: 0 } });

  const ejecutarAccion = accionForm.handleSubmit(async ({ monto }) => {
    if (!accion) return;
    const { tipo, t } = accion;
    if (tipo === 'seniar') await seniar.mutateAsync({ id: t.id, d: { montoSenia: monto } });
    else if (tipo === 'vender') await vender.mutateAsync({ id: t.id, d: { precioVenta: monto } });
    else await cancelar.mutateAsync(t.id);
    setAccion(null);
  });

  const accionLabel = { seniar: 'Registrar seña', vender: 'Confirmar venta', cancelar: 'Cancelar transacción' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Transacciones</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión comercial — reservas y ventas</p>
        </div>
        <button onClick={() => setModalCrear(true)} className="btn-admin-primary flex items-center gap-2">
          <Plus size={16} /> Nueva transacción
        </button>
      </div>

      {/* Filtro estado */}
      <div className="flex gap-2 mb-6">
        {['', ...ESTADOS].map(e => (
          <button key={e} onClick={() => setFiltroEstado(e)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filtroEstado === e ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0f0f0f]' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
            {e === '' ? 'Todos' : transaccionEstadoLabel[e as EstadoTransaccion]}
          </button>
        ))}
      </div>

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

      {isLoading ? <Spinner size={36} className="py-20" /> : filtrada.length === 0 ? (
        <EmptyState icon={<ReceiptText size={48} />} title="Sin transacciones" description="Creá una nueva transacción para comenzar." />
      ) : (
        <div className="card-admin overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['ID', 'Vehículo', 'Cliente', 'Vendedor', 'Estado', 'Precio', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrada.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-xs">#{t.id}</td>
                  <td className="px-4 py-3 font-semibold">#{t.vehiculo_id} - {t.patente}</td>
                  <td className="px-4 py-3 text-slate-600">#{t.cliente_id} - {t.cliente_email}</td>
                  <td className="px-4 py-3 text-slate-600">#{t.vendedor_id} - {t.vendedor_email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${transaccionEstadoBadge[t.estadoTransaccion]}`}>
                      {transaccionEstadoLabel[t.estadoTransaccion]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{t.precio_final ? formatPrice(t.precio_final) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {t.estadoTransaccion === 'RESERVA' && (
                        <button onClick={() => { accionForm.reset({ monto: 0 }); setAccion({ tipo: 'seniar', t }); }}
                          className="btn-admin-secondary text-xs py-1">Señar</button>
                      )}
                      {(t.estadoTransaccion === 'RESERVA' || t.estadoTransaccion === 'SENIADO') && (
                        <button onClick={() => { accionForm.reset({ monto: t.precio_final ?? 0 }); setAccion({ tipo: 'vender', t }); }}
                          className="btn-admin-primary text-xs py-1">Vender</button>
                      )}
                      {t.estadoTransaccion !== 'VENDIDO' && t.estadoTransaccion !== 'CANCELADO' && (
                        <button onClick={() => setAccion({ tipo: 'cancelar', t })}
                          className="btn-admin-danger text-xs py-1">Cancelar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear */}
      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title="Nueva transacción">
        <form onSubmit={crearForm.handleSubmit(d => crear.mutate(d, { onSuccess: () => { setModalCrear(false); crearForm.reset(); } }))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-admin">Vehículo ID *</label><input {...crearForm.register('vehiculo_id', { valueAsNumber: true })} type="number" className="input-admin" /></div>
            <div><label className="label-admin">Cliente ID *</label><input {...crearForm.register('cliente_id', { valueAsNumber: true })} type="number" className="input-admin" /></div>
            <div><label className="label-admin">Vendedor ID *</label><input {...crearForm.register('vendedor_id', { valueAsNumber: true })} type="number" className="input-admin" /></div>
            <div><label className="label-admin">Precio de venta</label><input {...crearForm.register('precio_final', { valueAsNumber: true })} type="number" className="input-admin" /></div>
            <div><label className="label-admin">Estado</label>
              <select {...crearForm.register('estadoTransaccion')} className="input-admin">
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div><label className="label-admin">Método de pago</label>
              <select {...crearForm.register('metodoPago')} className="input-admin">
                {MetodoPago.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div><label className="label-admin">Observaciones</label><input {...crearForm.register('observaciones')} type="text" className="input-admin" /></div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalCrear(false)} className="btn-admin-secondary">Cancelar</button>
            <button type="submit" disabled={crear.isPending} className="btn-admin-primary">{crear.isPending ? 'Creando…' : 'Crear'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal acción */}
      <Modal open={!!accion && accion.tipo !== 'cancelar'} onClose={() => setAccion(null)}
        title={accion ? accionLabel[accion.tipo] : ''} size="sm">
        {accion && (
          <form onSubmit={ejecutarAccion} className="space-y-4">
            <p className="text-sm text-slate-600">Transacción <strong>#{accion.t.id}</strong> · {accion.tipo === 'seniar' ? 'Ingresá el monto de la seña' : 'Confirmá el precio de venta'}</p>
            <div>
              <label className="label-admin">{accion.tipo === 'seniar' ? 'Monto de seña' : 'Precio final'}</label>
              <input {...accionForm.register('monto', { valueAsNumber: true })} type="number" className="input-admin" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setAccion(null)} className="btn-admin-secondary">Cancelar</button>
              <button type="submit" className="btn-admin-primary">Confirmar</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm cancelar */}
      <ConfirmDialog
        open={accion?.tipo === 'cancelar'}
        onClose={() => setAccion(null)}
        onConfirm={() => ejecutarAccion()}
        loading={cancelar.isPending}
        danger
        title="Cancelar transacción"
        message={`¿Confirmás la cancelación de la transacción #${accion?.t.id}?`}
      />
    </div>
  );
}
