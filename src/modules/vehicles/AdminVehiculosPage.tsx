import { useState } from 'react';
import { useVehiculosBusqueda, useVehiculosMutation } from '../../shared/hooks/useVehiculos';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import { formatPrice, estadoBadge, estadoLabel } from '../../shared/utils/format';
import { Plus, Pencil, Trash2, RefreshCw, Car } from 'lucide-react';
import type { Vehiculo } from '../../types/vehiculo';

const ESTADOS = ['DISPONIBLE','RESERVADO','VENDIDO','EN_REPARACION','BAJA'];
const COMBUSTIBLES = ['NAFTA','DIESEL','ELECTRICO','HIBRIDO','GNC'];
const TRANSMISIONES = ['MANUAL','AUTOMATICA'];

const VehiculoForm = ({ onSubmit, loading, defaultValues }: { onSubmit: (d: unknown) => void; loading: boolean; defaultValues?: Partial<Vehiculo> }) => {
  const { register, handleSubmit } = useForm({ defaultValues: defaultValues ?? {} });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label-admin">Patente *</label><input {...register('patente')} className="input-admin" placeholder="ABC123" /></div>
        <div><label className="label-admin">Año *</label><input {...register('anio', { valueAsNumber: true })} type="number" className="input-admin" /></div>
        <div><label className="label-admin">Modelo ID *</label><input {...register('modeloId', { valueAsNumber: true })} type="number" className="input-admin" /></div>
        <div><label className="label-admin">Color</label><input {...register('color')} className="input-admin" placeholder="Blanco" /></div>
        <div><label className="label-admin">Km</label><input {...register('kilometraje', { valueAsNumber: true })} type="number" className="input-admin" /></div>
        <div>
          <label className="label-admin">Estado</label>
          <select {...register('estado')} className="input-admin">
            {ESTADOS.map(e => <option key={e} value={e}>{estadoLabel[e]}</option>)}
          </select>
        </div>
        <div>
          <label className="label-admin">Combustible</label>
          <select {...register('tipoCombustible')} className="input-admin">
            {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label-admin">Transmisión</label>
          <select {...register('tipoTransmision')} className="input-admin">
            {TRANSMISIONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div><label className="label-admin">Precio adquisición</label><input {...register('precioAdquisicion', { valueAsNumber: true })} type="number" className="input-admin" /></div>
        <div><label className="label-admin">Precio venta *</label><input {...register('precioVenta', { valueAsNumber: true })} type="number" className="input-admin" /></div>
        <div className="col-span-2"><label className="label-admin">Descripción</label><textarea {...register('descripcion')} className="input-admin resize-none" rows={2} /></div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-admin-primary">
          {loading ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default function AdminVehiculosPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useVehiculosBusqueda({});
  const { crear, actualizar, eliminar, cambiarEstado } = useVehiculosMutation();
  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando] = useState<Vehiculo | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [cambioEstado, setCambioEstado] = useState<Vehiculo | null>(null);

  const vehiculos: Vehiculo[] = Array.isArray(data) ? data : data?.content ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="admin-page-title">Vehículos</h1>
          <p className="text-slate-500 text-sm mt-1">{vehiculos.length} unidades en el sistema</p>
        </div>
        <button onClick={() => setModalCrear(true)} className="btn-admin-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo vehículo
        </button>
      </div>

      {isLoading ? <Spinner size={36} className="py-20" /> : vehiculos.length === 0 ? (
        <EmptyState icon={<Car size={48} />} title="Sin vehículos" action={<button onClick={() => setModalCrear(true)} className="btn-admin-primary">Agregar primero</button>} />
      ) : (
        <div className="card-admin overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['ID','Patente','Año','Color','Estado','Precio venta','Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehiculos.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">#{v.id}</td>
                  <td className="px-4 py-3 font-mono font-semibold">{v.patente}</td>
                  <td className="px-4 py-3">{v.anio}</td>
                  <td className="px-4 py-3">{v.color}</td>
                  <td className="px-4 py-3"><span className={estadoBadge[v.estado]}>{estadoLabel[v.estado]}</span></td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(v.precioVenta)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCambioEstado(v)} title="Cambiar estado" className="text-slate-400 hover:text-blue-600 transition-colors"><RefreshCw size={15} /></button>
                      <button onClick={() => setEditando(v)} title="Editar" className="text-slate-400 hover:text-[#c9a84c] transition-colors"><Pencil size={15} /></button>
                      {user?.rol === 'ADMIN' && (
                        <button onClick={() => setEliminando(v.id)} title="Eliminar" className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
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
      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title="Nuevo vehículo" size="lg">
        <VehiculoForm loading={crear.isPending} onSubmit={(d) => crear.mutate(d, { onSuccess: () => setModalCrear(false) })} />
      </Modal>

      {/* Modal editar */}
      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar vehículo" size="lg">
        {editando && <VehiculoForm loading={actualizar.isPending} defaultValues={editando}
          onSubmit={(d) => actualizar.mutate({ id: editando.id, data: d }, { onSuccess: () => setEditando(null) })} />}
      </Modal>

      {/* Modal cambio de estado */}
      <Modal open={!!cambioEstado} onClose={() => setCambioEstado(null)} title="Cambiar estado" size="sm">
        {cambioEstado && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Seleccioná el nuevo estado para <strong>{cambioEstado.patente}</strong>:</p>
            <div className="space-y-2">
              {ESTADOS.map(e => (
                <button key={e} onClick={() => cambiarEstado.mutate({ id: cambioEstado.id, estado: e }, { onSuccess: () => setCambioEstado(null) })}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    cambioEstado.estado === e ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#0f0f0f]' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  {estadoLabel[e]}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmDialog
        open={eliminando !== null}
        onClose={() => setEliminando(null)}
        onConfirm={() => eliminar.mutate(eliminando!, { onSuccess: () => setEliminando(null) })}
        loading={eliminar.isPending}
        danger
        title="Eliminar vehículo"
        message="Esta acción no se puede deshacer. ¿Querés continuar?"
      />
    </div>
  );
}
