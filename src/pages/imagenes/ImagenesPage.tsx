import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { imagenesApi } from '../../api/imagenes.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import { Loader2, ImageOff } from 'lucide-react';

function ImagePreview({ url }: { url: string }) {
  const [ok, setOk] = useState(true);
  if (!url || !ok) return (
    <div className="mt-2 h-24 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs gap-2">
      <ImageOff size={14} /> Sin preview
    </div>
  );
  return (
    <img src={url} alt="preview" onError={() => setOk(false)}
      className="mt-2 max-h-40 rounded-lg border border-slate-200 object-contain bg-slate-50 w-full" />
  );
}

export default function ImagenesPage() {
  const [previewUrl, setPreviewUrl] = useState('');
  const [updatePreviewUrl, setUpdatePreviewUrl] = useState('');
  const listarLog = useRequestLog();
  const obtenerLog = useRequestLog();
  const porVehiculoLog = useRequestLog();
  const crearLog = useRequestLog();
  const actualizarLog = useRequestLog();
  const eliminarLog = useRequestLog();

  const obtenerForm = useForm({ defaultValues: { id: 0 } });
  const porVehiculoForm = useForm({ defaultValues: { vehiculoId: 0 } });
  const crearForm = useForm({ defaultValues: { url: '', descripcion: '', esPrincipal: false, vehiculoId: 0 } });
  const actualizarForm = useForm({ defaultValues: { id: 0, url: '', descripcion: '', esPrincipal: false, vehiculoId: 0 } });
  const eliminarForm = useForm({ defaultValues: { id: 0 } });

  return (
    <div>
      <PageHeader title="Imágenes" subtitle="Gestión de imágenes de vehículos con preview." badge="6 endpoints" />
      <div className="space-y-4 max-w-2xl">

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/imagenes</code></div>
            <button onClick={() => listarLog.execute('GET', '/imagenes', undefined, () => imagenesApi.listar())} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
              {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <ApiResponseCard log={listarLog.log} />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/imagenes/{'{id}'}</code></div>
            <button onClick={obtenerForm.handleSubmit(({ id }) => obtenerLog.execute('GET', `/imagenes/${id}`, undefined, () => imagenesApi.obtener(id)))} disabled={obtenerLog.loading} className="btn-primary flex items-center gap-2">
              {obtenerLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID</label>
            <input {...obtenerForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={obtenerLog.log} />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/imagenes/vehiculo/{'{vehiculoId}'}</code></div>
            <button onClick={porVehiculoForm.handleSubmit(({ vehiculoId }) => porVehiculoLog.execute('GET', `/imagenes/vehiculo/${vehiculoId}`, undefined, () => imagenesApi.obtenerPorVehiculo(vehiculoId)))} disabled={porVehiculoLog.loading} className="btn-primary flex items-center gap-2">
              {porVehiculoLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">Vehículo ID</label>
            <input {...porVehiculoForm.register('vehiculoId', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={porVehiculoLog.log} />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-post">POST</span><code className="text-sm font-mono text-slate-700">/imagenes</code></div>
            <button onClick={crearForm.handleSubmit(async (data) => { await crearLog.execute('POST', '/imagenes', data, () => imagenesApi.crear(data)); toast.success('Imagen creada'); })} disabled={crearLog.loading} className="btn-primary flex items-center gap-2">
              {crearLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">URL de imagen</label>
              <input {...crearForm.register('url')} className="input" placeholder="https://ejemplo.com/auto.jpg" onChange={(e) => setPreviewUrl(e.target.value)} />
              <ImagePreview url={previewUrl} />
            </div>
            <div className="col-span-2"><label className="label">Descripción</label><input {...crearForm.register('descripcion')} className="input" placeholder="Vista frontal" /></div>
            <div><label className="label">Vehículo ID</label><input {...crearForm.register('vehiculoId', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div className="flex items-center gap-2 pt-5">
              <input {...crearForm.register('esPrincipal')} type="checkbox" id="prin-c" />
              <label htmlFor="prin-c" className="text-sm">Es principal</label>
            </div>
          </div>
          <ApiResponseCard log={crearLog.log} />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-put">PUT</span><code className="text-sm font-mono text-slate-700">/imagenes/{'{id}'}</code></div>
            <button onClick={actualizarForm.handleSubmit(async ({ id, ...data }) => { await actualizarLog.execute('PUT', `/imagenes/${id}`, data, () => imagenesApi.actualizar(id, data)); toast.success('Imagen actualizada'); })} disabled={actualizarLog.loading} className="btn-primary flex items-center gap-2">
              {actualizarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div><label className="label">ID</label><input {...actualizarForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Vehículo ID</label><input {...actualizarForm.register('vehiculoId', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div className="col-span-2">
              <label className="label">URL</label>
              <input {...actualizarForm.register('url')} className="input" placeholder="https://ejemplo.com/foto.jpg" onChange={(e) => setUpdatePreviewUrl(e.target.value)} />
              <ImagePreview url={updatePreviewUrl} />
            </div>
            <div className="col-span-2"><label className="label">Descripción</label><input {...actualizarForm.register('descripcion')} className="input" placeholder="Vista lateral" /></div>
            <div className="flex items-center gap-2">
              <input {...actualizarForm.register('esPrincipal')} type="checkbox" id="prin-u" />
              <label htmlFor="prin-u" className="text-sm">Es principal</label>
            </div>
          </div>
          <ApiResponseCard log={actualizarLog.log} />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-delete">DELETE</span><code className="text-sm font-mono text-slate-700">/imagenes/{'{id}'}</code></div>
            <button onClick={eliminarForm.handleSubmit(async ({ id }) => { await eliminarLog.execute('DELETE', `/imagenes/${id}`, undefined, () => imagenesApi.eliminar(id)); toast.success('Imagen eliminada'); })} disabled={eliminarLog.loading} className="btn-danger flex items-center gap-2">
              {eliminarLog.loading && <Loader2 size={14} className="animate-spin" />} Eliminar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID</label>
            <input {...eliminarForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={eliminarLog.log} />
        </div>

      </div>
    </div>
  );
}
