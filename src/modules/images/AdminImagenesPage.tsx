import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imagenesApi } from '../../api/imagenes.api';
import { useForm } from 'react-hook-form';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import { toast } from 'sonner';
import { Plus, Trash2, Image, ImageOff, Pencil } from 'lucide-react';
import { vehiculosApi } from '../../api/vehiculos.api';
import type { CreateImagenRequest, Imagen } from '../../types/imagen';


function Prev({ url }: { url: string }) {
  const [ok, setOk] = useState(true);
  if (!url || !ok) return <div className="w-24 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-300"><ImageOff size={16} /></div>;
  return <img src={url} alt="" onError={() => setOk(false)} className="w-24 h-16 object-cover rounded border border-slate-200" />;
}

export default function AdminImagenesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['imagenes'], queryFn: () => imagenesApi.listar().then(r => r.data) });
  const crear = useMutation({ mutationFn: (d: CreateImagenRequest) => imagenesApi.crear(d), onSuccess: () => { toast.success('Imagen cargada'); qc.invalidateQueries({ queryKey: ['imagenes'] }); } });
  const eliminar = useMutation({ mutationFn: (id: number) => imagenesApi.eliminar(id), onSuccess: () => { toast.success('Imagen eliminada'); qc.invalidateQueries({ queryKey: ['imagenes'] }); } });
  const [modalCrear, setModalCrear] = useState(false);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [preview, setPreview] = useState('');
  const form = useForm({ defaultValues: { url: '', descripcion: '', esPrincipal: false, vehiculoId: 0 } });

  const { data: vehiculosData } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: () =>
      vehiculosApi.busqueda({}).then(r => r.data),
  });

  const lista: Imagen[] = Array.isArray(data) ? data : data?.content ?? [];
  const vehiculos = Array.isArray(vehiculosData?.content)
    ? vehiculosData.content
    : [];


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="admin-page-title">Imágenes</h1><p className="text-slate-500 text-sm mt-1">{lista.length} imágenes registradas</p></div>
        <button onClick={() => setModalCrear(true)} className="btn-admin-primary flex items-center gap-2"><Plus size={16} /> Cargar imagen</button>
      </div>

      {isLoading ? <Spinner size={36} className="py-20" /> : lista.length === 0 ? (
        <EmptyState icon={<Image size={48} />} title="Sin imágenes" />
      ) : (
        <div className="card-admin overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>{['Preview', 'URL', 'Vehículo', 'Principal', 'Acciones'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map(img => (
                <tr key={img.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2"><Prev url={img.url} /></td>
                  <td className="px-4 py-3 max-w-xs"><p className="text-xs text-slate-500 truncate">{img.url}</p></td>
                  <td className="px-4 py-3 font-semibold">#{img.patenteVehiculo}</td>
                  <td className="px-4 py-3">{img.esPrincipal ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-3">
                    <button className="text-slate-400 hover:text-red-600"><Pencil size={15} /></button>
                    <button onClick={() => setEliminando(img.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalCrear} onClose={() => { setModalCrear(false); setPreview(''); }} title="Cargar imagen">
        <form onSubmit={form.handleSubmit(d => crear.mutate(d, { onSuccess: () => { setModalCrear(false); form.reset(); setPreview(''); } }))} className="space-y-4">
          <div>
            <label className="label-admin">URL de la imagen *</label>
            <input {...form.register('url')} className="input-admin" placeholder="https://..." onChange={e => setPreview(e.target.value)} />
            {preview && (
              <div className="mt-2 h-40 bg-slate-50 rounded border border-slate-200 overflow-hidden">
                <img src={preview} alt="preview" onError={() => setPreview('')} className="w-full h-full object-contain" />
              </div>
            )}
          </div>
          <div><label className="label-admin">Descripción</label><input {...form.register('descripcion')} className="input-admin" placeholder="Vista frontal" /></div>
          <div>
            <label className="label-admin">Vehículo *</label>

            <select
              {...form.register('vehiculoId', { valueAsNumber: true })}
              className="input-admin"
            >
              <option value={0}>
                Seleccione un vehículo
              </option>

              {vehiculos.map((v: any) => (
                <option
                  key={v.id}
                  value={v.id}
                >
                  #{v.id} - {v.patente} - {v.modeloNombre} ({v.anio})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2"><input {...form.register('esPrincipal')} type="checkbox" id="prin" /><label htmlFor="prin" className="text-sm text-slate-700">Imagen principal</label></div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalCrear(false)} className="btn-admin-secondary">Cancelar</button><button type="submit" disabled={crear.isPending} className="btn-admin-primary">Cargar</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={eliminando !== null} onClose={() => setEliminando(null)} onConfirm={() => eliminar.mutate(eliminando!, { onSuccess: () => setEliminando(null) })} loading={eliminar.isPending} danger title="Eliminar imagen" message="¿Confirmás la eliminación?" />
    </div>
  );
}
