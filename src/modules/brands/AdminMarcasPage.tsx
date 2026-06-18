import { useState } from 'react';
import { useMarcas, useMarcasMutation } from '../../shared/hooks/useMarcas';
import { useForm } from 'react-hook-form';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Spinner from '../../shared/components/Spinner';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import EmptyState from '../../shared/components/EmptyState';

interface MarcaForm { nombre: string; paisOrigen: string; }
type Marca = { id: number; nombre: string; paisOrigen?: string; activo?: boolean };

export default function AdminMarcasPage() {
  const { data, isLoading } = useMarcas();
  const { crear, actualizar, eliminar } = useMarcasMutation();
  const [modalCrear, setModalCrear] = useState(false);
  const [editando, setEditando] = useState<Marca | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const crearForm = useForm<MarcaForm>();
  const editarForm = useForm<MarcaForm>();

  const marcas: Marca[] = Array.isArray(data) ? data : data?.content ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="admin-page-title">Marcas</h1><p className="text-slate-500 text-sm mt-1">{marcas.length} marcas registradas</p></div>
        <button onClick={() => setModalCrear(true)} className="btn-admin-primary flex items-center gap-2"><Plus size={16} /> Nueva marca</button>
      </div>

      {isLoading ? <Spinner size={36} className="py-20" /> : marcas.length === 0 ? (
        <EmptyState icon={<Tag size={48} />} title="Sin marcas" action={<button onClick={() => setModalCrear(true)} className="btn-admin-primary">Agregar primera</button>} />
      ) : (
        <div className="card-admin overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['ID', 'Nombre', 'Activa', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marcas.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-xs">#{m.id}</td>
                  <td className="px-4 py-3 font-semibold">{m.nombre}</td>
                  <td className="px-4 py-3">{m.activo !== false ? <span className="badge-disponible">Sí</span> : <span className="badge-baja">No</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { editarForm.reset({ nombre: m.nombre, paisOrigen: m.paisOrigen ?? '' }); setEditando(m); }} className="text-slate-400 hover:text-[#c9a84c] transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setEliminando(m.id)} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalCrear} onClose={() => setModalCrear(false)} title="Nueva marca" size="sm">
        <form onSubmit={crearForm.handleSubmit(d => crear.mutate(d, { onSuccess: () => { setModalCrear(false); crearForm.reset(); } }))} className="space-y-4">
          <div><label className="label-admin">Nombre *</label><input {...crearForm.register('nombre')} className="input-admin" placeholder="Toyota" /></div>
          <div><label className="label-admin">País de origen</label><input {...crearForm.register('paisOrigen')} className="input-admin" placeholder="Japón" /></div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalCrear(false)} className="btn-admin-secondary">Cancelar</button><button type="submit" disabled={crear.isPending} className="btn-admin-primary">Crear</button></div>
        </form>
      </Modal>

      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar marca" size="sm">
        <form onSubmit={editarForm.handleSubmit(d => actualizar.mutate({ id: editando!.id, d }, { onSuccess: () => setEditando(null) }))} className="space-y-4">
          <div><label className="label-admin">Nombre</label><input {...editarForm.register('nombre')} className="input-admin" /></div>
          <div><label className="label-admin">País de origen</label><input {...editarForm.register('paisOrigen')} className="input-admin" /></div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditando(null)} className="btn-admin-secondary">Cancelar</button><button type="submit" disabled={actualizar.isPending} className="btn-admin-primary">Guardar</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={eliminando !== null} onClose={() => setEliminando(null)} onConfirm={() => eliminar.mutate(eliminando!, { onSuccess: () => setEliminando(null) })} loading={eliminar.isPending} danger title="Eliminar marca" message="¿Estás seguro de que querés eliminar esta marca?" />
    </div>
  );
}
