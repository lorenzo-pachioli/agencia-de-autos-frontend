import { useState } from 'react';
import { useModelos, useModelosMutation } from '../../shared/hooks/useModelos';
import { useMarcas } from '../../shared/hooks/useMarcas';
import { useForm } from 'react-hook-form';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import { Plus, Pencil, Trash2, Layers } from 'lucide-react';
import { tipoModelo, type Modelo, type ModeloForm } from '../../types/modelo';


export default function AdminModelosPage() {
  const { data, isLoading } = useModelos();
  const { data: marcasData } = useMarcas();
  const { crear, actualizar, eliminar } = useModelosMutation();
  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando] = useState<Modelo | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const crearForm = useForm<ModeloForm>({ defaultValues: { nombre: '', anio: 2024, tipoModelo: tipoModelo.AUTO, activo: true, marcaId: 0 } });
  const editarForm = useForm<ModeloForm>({ defaultValues: { nombre: '', anio: 2024, tipoModelo: tipoModelo.AUTO, activo: true, marcaId: 0 } });

  const modelos: Modelo[] = Array.isArray(data) ? data : (data as { content?: Modelo[] })?.content ?? [];
  const marcas: { id: number; nombre: string }[] = Array.isArray(marcasData) ? marcasData : (marcasData as { content?: { id: number; nombre: string }[] })?.content ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="admin-page-title">Modelos</h1><p className="text-slate-500 text-sm mt-1">{modelos.length} modelos registrados</p></div>
        <button onClick={() => setModalCrear(true)} className="btn-admin-primary flex items-center gap-2"><Plus size={16} /> Nuevo modelo</button>
      </div>

      {isLoading ? <Spinner size={36} className="py-20" /> : modelos.length === 0 ? (
        <EmptyState icon={<Layers size={48} />} title="Sin modelos" />
      ) : (
        <div className="card-admin overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>{['ID', 'Nombre', 'Año', 'Tipo', 'Marca', 'Activo', 'Acciones'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {modelos.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-xs">#{m.id}</td>
                  <td className="px-4 py-3 font-semibold">{m.nombre}</td>
                  <td className="px-4 py-3">{m.anio}</td>
                  <td className="px-4 py-3 text-slate-600">{m.tipoModelo}</td>
                  <td className="px-4 py-3 text-slate-600">{m.marca}</td>
                  <td className="px-4 py-3">{m.activo ? <span className="badge-disponible">Sí</span> : <span className="badge-baja">No</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { editarForm.reset({ nombre: m.nombre, anio: m.anio, tipoModelo: m.tipoModelo, activo: m.activo }); setEditando(m); }} className="text-slate-400 hover:text-[#c9a84c]"><Pencil size={15} /></button>
                      <button onClick={() => setEliminando(m.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title="Nuevo modelo">
        <form onSubmit={crearForm.handleSubmit(d => crear.mutate(d, { onSuccess: () => { setModalCrear(false); crearForm.reset(); } }))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-admin">Nombre *</label><input {...crearForm.register('nombre')} className="input-admin" /></div>
            <div><label className="label-admin">Año</label><input {...crearForm.register('anio', { valueAsNumber: true })} type="number" className="input-admin" /></div>
            <div>
              <label className="label-admin">Tipo</label>
              <select {...crearForm.register('tipoModelo')} className="input-admin">{Object.values(tipoModelo).map((t) => <option key={t} value={t}>{t}</option>)}</select>
            </div>
            <div>
              <label className="label-admin">Marca</label>
              <select {...crearForm.register('marcaId', { valueAsNumber: true })} className="input-admin">
                <option value={0}>— Seleccionar —</option>
                {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2"><input {...crearForm.register('activo')} type="checkbox" id="activo-c" /><label htmlFor="activo-c" className="text-sm">Activo</label></div>
          </div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalCrear(false)} className="btn-admin-secondary">Cancelar</button><button type="submit" disabled={crear.isPending} className="btn-admin-primary">Crear</button></div>
        </form>
      </Modal>

      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar modelo">
        <form onSubmit={editarForm.handleSubmit(d => actualizar.mutate({ id: editando!.id, d }, { onSuccess: () => setEditando(null) }))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-admin">Nombre</label><input {...editarForm.register('nombre')} className="input-admin" /></div>
            <div><label className="label-admin">Año</label><input {...editarForm.register('anio', { valueAsNumber: true })} type="number" className="input-admin" /></div>
            <div>
              <label className="label-admin">Tipo</label>
              <select {...editarForm.register('tipoModelo')} className="input-admin">{Object.values(tipoModelo).map(t => <option key={t} value={t}>{t}</option>)}</select>
            </div>
            <div>
              <label className="label-admin">Marca</label>
              <select {...editarForm.register('marcaId', { valueAsNumber: true })} className="input-admin">
                <option value={0}>— Seleccionar —</option>
                {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditando(null)} className="btn-admin-secondary">Cancelar</button><button type="submit" disabled={actualizar.isPending} className="btn-admin-primary">Guardar</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={eliminando !== null} onClose={() => setEliminando(null)} onConfirm={() => eliminar.mutate(eliminando!, { onSuccess: () => setEliminando(null) })} loading={eliminar.isPending} danger title="Eliminar modelo" message="¿Confirmás la eliminación del modelo?" />
    </div>
  );
}
