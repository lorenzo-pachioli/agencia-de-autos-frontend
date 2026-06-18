import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { marcasApi } from '../../api/marcas.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import type { Marca } from '../../types/marca';
import { Loader2 } from 'lucide-react';

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const listarLog = useRequestLog();
  const obtenerLog = useRequestLog();
  const crearLog = useRequestLog();
  const actualizarLog = useRequestLog();
  const eliminarLog = useRequestLog();

  const obtenerForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });
  const crearForm = useForm<{ nombre: string; paisOrigen: string }>({ defaultValues: { nombre: '', paisOrigen: '' } });
  const actualizarForm = useForm<{ id: number; nombre: string; paisOrigen: string }>({ defaultValues: { id: 0, nombre: '', paisOrigen: '' } });
  const eliminarForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });

  const handleListar = async () => {
    const res = await listarLog.execute('GET', '/marcas', undefined, () => marcasApi.listar());
    if (Array.isArray(res)) setMarcas(res);
    else if (res && Array.isArray((res as { content?: Marca[] }).content)) setMarcas((res as { content: Marca[] }).content);
  };

  const handleObtener = obtenerForm.handleSubmit(async ({ id }) => {
    await obtenerLog.execute('GET', `/marcas/${id}`, undefined, () => marcasApi.obtener(id));
  });

  const handleCrear = crearForm.handleSubmit(async (data) => {
    const payload = { nombre: data.nombre, ...(data.paisOrigen ? { paisOrigen: data.paisOrigen } : {}) };
    await crearLog.execute('POST', '/marcas', payload, () => marcasApi.crear(payload));
    toast.success('Marca creada');
  });

  const handleActualizar = actualizarForm.handleSubmit(async ({ id, ...data }) => {
    const payload = { nombre: data.nombre, ...(data.paisOrigen ? { paisOrigen: data.paisOrigen } : {}) };
    await actualizarLog.execute('PUT', `/marcas/${id}`, payload, () => marcasApi.actualizar(id, payload));
    toast.success('Marca actualizada');
  });

  const handleEliminar = eliminarForm.handleSubmit(async ({ id }) => {
    await eliminarLog.execute('DELETE', `/marcas/${id}`, undefined, () => marcasApi.eliminar(id));
    toast.success('Marca eliminada');
  });
return (
    <div>
      <PageHeader title="Marcas" subtitle="CRUD completo de marcas de vehículos." badge="5 endpoints" />

      <div className="space-y-4 max-w-2xl">
        {/* Listar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/marcas</code>
            </div>
            <button onClick={handleListar} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
              {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          {marcas.length > 0 && (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'nombre', label: 'Nombre' },
                { key: 'paisOrigen', label: 'País' },
                { key: 'activo', label: 'Activo', render: r => (r.activo ? '✅' : '❌') },
              ]}
              data={marcas as unknown as Record<string, unknown>[]}
            />
          )}
          <ApiResponseCard log={listarLog.log} />
        </div>

        {/* Obtener por ID */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/marcas/{'{id}'}</code>
            </div>
            <button onClick={handleObtener} disabled={obtenerLog.loading} className="btn-primary flex items-center gap-2">
              {obtenerLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID</label>
            <input {...obtenerForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={obtenerLog.log} />
        </div>

        {/* Crear */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-post">POST</span>
              <code className="text-sm font-mono text-slate-700">/marcas</code>
            </div>
            <button onClick={handleCrear} disabled={crearLog.loading} className="btn-primary flex items-center gap-2">
              {crearLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nombre *</label>
              <input {...crearForm.register('nombre')} className="input" placeholder="Toyota" />
            </div>
            <div>
              <label className="label">País de origen</label>
              <input {...crearForm.register('paisOrigen')} className="input" placeholder="Japón" />
            </div>
          </div>
          <ApiResponseCard log={crearLog.log} />
        </div>

        {/* Actualizar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-put">PUT</span>
              <code className="text-sm font-mono text-slate-700">/marcas/{'{id}'}</code>
            </div>
            <button onClick={handleActualizar} disabled={actualizarLog.loading} className="btn-primary flex items-center gap-2">
              {actualizarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-3 gap-3">
            <div>
              <label className="label">ID</label>
              <input {...actualizarForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" />
            </div>
            <div>
              <label className="label">Nombre</label>
              <input {...actualizarForm.register('nombre')} className="input" placeholder="Toyota" />
            </div>
            <div>
              <label className="label">País</label>
              <input {...actualizarForm.register('paisOrigen')} className="input" placeholder="Japón" />
            </div>
          </div>
          <ApiResponseCard log={actualizarLog.log} />
        </div>

        {/* Eliminar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-delete">DELETE</span>
              <code className="text-sm font-mono text-slate-700">/marcas/{'{id}'}</code>
            </div>
            <button onClick={handleEliminar} disabled={eliminarLog.loading} className="btn-danger flex items-center gap-2">
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
