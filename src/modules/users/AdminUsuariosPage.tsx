import { useState } from 'react';
import { useUsuarios, useUsuariosMutation } from '../../shared/hooks/useUsuarios';
import { useForm } from 'react-hook-form';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import { Plus, Pencil, UserX, Users } from 'lucide-react';
import type { Usuario } from '../../types/usuario';

export default function AdminUsuariosPage() {
  const { data, isLoading } = useUsuarios();
  const { actualizar, darBaja, crearVendedor } = useUsuariosMutation();
  const [modalVendedor, setModalVendedor] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [bajando, setBajando] = useState<number | null>(null);
  const vendedorForm = useForm({ defaultValues: { nombre: '', apellido: '', email: '', password: '' } });
  const editarForm = useForm({ defaultValues: { nombre: '', apellido: '', email: '' } });

  const usuarios: Usuario[] = Array.isArray(data) ? data : data?.content ?? [];
  const rolColor: Record<string, string> = { ADMIN: 'bg-purple-100 text-purple-700', VENDEDOR: 'bg-blue-100 text-blue-700', CLIENTE: 'bg-slate-100 text-slate-600' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="admin-page-title">Usuarios</h1><p className="text-slate-500 text-sm mt-1">{usuarios.length} usuarios registrados</p></div>
        <button onClick={() => setModalVendedor(true)} className="btn-admin-primary flex items-center gap-2"><Plus size={16} /> Nuevo vendedor</button>
      </div>

      {isLoading ? <Spinner size={36} className="py-20" /> : usuarios.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="Sin usuarios" />
      ) : (
        <div className="card-admin overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>{['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Acciones'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-xs">#{u.id}</td>
                  <td className="px-4 py-3 font-semibold">{u.nombre} {u.apellido}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rolColor[u.rolUsuario] ?? 'bg-slate-100'}`}>{u.rolUsuario}</span></td>
                  <td className="px-4 py-3">{u.activo ? <span className="badge-disponible">Activo</span> : <span className="badge-baja">Baja</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { editarForm.reset({ nombre: u.nombre, apellido: u.apellido, email: u.email }); setEditando(u); }} className="text-slate-400 hover:text-[#c9a84c]"><Pencil size={15} /></button>
                      {u.activo && <button onClick={() => setBajando(u.id)} className="text-slate-400 hover:text-red-600"><UserX size={15} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalVendedor} onClose={() => setModalVendedor(false)} title="Crear vendedor" size="sm">
        <form onSubmit={vendedorForm.handleSubmit(d => crearVendedor.mutate(d, { onSuccess: () => { setModalVendedor(false); vendedorForm.reset(); } }))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-admin">Nombre *</label><input {...vendedorForm.register('nombre')} className="input-admin" /></div>
            <div><label className="label-admin">Apellido *</label><input {...vendedorForm.register('apellido')} className="input-admin" /></div>
          </div>
          <div><label className="label-admin">Email *</label><input {...vendedorForm.register('email')} type="email" className="input-admin" /></div>
          <div><label className="label-admin">Contraseña *</label><input {...vendedorForm.register('password')} type="password" className="input-admin" /></div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalVendedor(false)} className="btn-admin-secondary">Cancelar</button><button type="submit" disabled={crearVendedor.isPending} className="btn-admin-primary">Crear vendedor</button></div>
        </form>
      </Modal>

      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar usuario" size="sm">
        <form onSubmit={editarForm.handleSubmit(d => actualizar.mutate({ id: editando!.id, d }, { onSuccess: () => setEditando(null) }))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-admin">Nombre</label><input {...editarForm.register('nombre')} className="input-admin" /></div>
            <div><label className="label-admin">Apellido</label><input {...editarForm.register('apellido')} className="input-admin" /></div>
          </div>
          <div><label className="label-admin">Email</label><input {...editarForm.register('email')} type="email" className="input-admin" /></div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditando(null)} className="btn-admin-secondary">Cancelar</button><button type="submit" disabled={actualizar.isPending} className="btn-admin-primary">Guardar</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={bajando !== null} onClose={() => setBajando(null)} onConfirm={() => darBaja.mutate(bajando!, { onSuccess: () => setBajando(null) })} loading={darBaja.isPending} danger title="Dar de baja al usuario" message="Se desactivará la cuenta del usuario. ¿Confirmás?" />
    </div>
  );
}
