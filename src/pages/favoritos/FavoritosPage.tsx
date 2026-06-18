import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { favoritosApi } from '../../api/favoritos.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { Loader2 } from 'lucide-react';

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<Record<string, unknown>[]>([]);
  const listarLog = useRequestLog();
  const agregarLog = useRequestLog();
  const eliminarLog = useRequestLog();

  const agregarForm = useForm({ defaultValues: { vehiculoId: 0 } });
  const eliminarForm = useForm({ defaultValues: { vehiculoId: 0 } });

  const handleListar = async () => {
    const res = await listarLog.execute('GET', '/favoritos', undefined, () => favoritosApi.listar());
    if (Array.isArray(res)) setFavoritos(res as Record<string, unknown>[]);
    else if (res && Array.isArray((res as { content?: unknown[] }).content)) setFavoritos((res as { content: Record<string, unknown>[] }).content);
  };

  return (
    <div>
      <PageHeader title="Favoritos" subtitle="Gestión de vehículos favoritos del usuario autenticado." badge="3 endpoints" />
      <div className="space-y-4 max-w-2xl">

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/favoritos</code></div>
            <button onClick={handleListar} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
              {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          {favoritos.length > 0 && (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'vehiculoId', label: 'Vehículo ID' },
                { key: 'patente', label: 'Patente' },
                { key: 'modelo', label: 'Modelo' },
              ]}
              data={favoritos}
            />
          )}
          <ApiResponseCard log={listarLog.log} />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-post">POST</span><code className="text-sm font-mono text-slate-700">/favoritos/agregar/{'{vehiculoId}'}</code></div>
            <button onClick={agregarForm.handleSubmit(async ({ vehiculoId }) => {
              await agregarLog.execute('POST', `/favoritos/agregar/${vehiculoId}`, undefined, () => favoritosApi.agregar(vehiculoId));
              toast.success('Agregado a favoritos');
            })} disabled={agregarLog.loading} className="btn-primary flex items-center gap-2">
              {agregarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">Vehículo ID</label>
            <input {...agregarForm.register('vehiculoId', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={agregarLog.log} />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-delete">DELETE</span><code className="text-sm font-mono text-slate-700">/favoritos/eliminar/{'{vehiculoId}'}</code></div>
            <button onClick={eliminarForm.handleSubmit(async ({ vehiculoId }) => {
              await eliminarLog.execute('DELETE', `/favoritos/eliminar/${vehiculoId}`, undefined, () => favoritosApi.eliminar(vehiculoId));
              toast.success('Eliminado de favoritos');
            })} disabled={eliminarLog.loading} className="btn-danger flex items-center gap-2">
              {eliminarLog.loading && <Loader2 size={14} className="animate-spin" />} Eliminar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">Vehículo ID</label>
            <input {...eliminarForm.register('vehiculoId', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={eliminarLog.log} />
        </div>

      </div>
    </div>
  );
}
