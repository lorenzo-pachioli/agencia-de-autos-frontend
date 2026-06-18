import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { modelosApi } from '../../api/modelos.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import type { Modelo } from '../../types/modelo';
import { Loader2 } from 'lucide-react';

const TIPOS_MODELO = ['SEDAN', 'SUV', 'PICKUP', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'MINIVAN', 'FURGON'];

export default function ModelosPage() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const listarLog = useRequestLog();
  const obtenerLog = useRequestLog();
  const crearLog = useRequestLog();
  const actualizarLog = useRequestLog();
  const eliminarLog = useRequestLog();

  const obtenerForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });
  const crearForm = useForm({ defaultValues: { nombre: '', anio: 2024, tipoModelo: '', activo: true, marcaId: 0 } });
  const actualizarForm = useForm({ defaultValues: { id: 0, nombre: '', anio: 2024, tipoModelo: '', activo: true, marcaId: 0 } });
  const eliminarForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });

  const handleListar = async () => {
    const res = await listarLog.execute('GET', '/modelos', undefined, () => modelosApi.listar());
    if (Array.isArray(res)) setModelos(res);
    else if (res && Array.isArray((res as { content?: Modelo[] }).content)) setModelos((res as { content: Modelo[] }).content);
  };

  const handleObtener = obtenerForm.handleSubmit(async ({ id }) => {
    await obtenerLog.execute('GET', `/modelos/${id}`, undefined, () => modelosApi.obtener(id));
  });

  const handleCrear = crearForm.handleSubmit(async (data) => {
    await crearLog.execute('POST', '/modelos', data, () => modelosApi.crear(data));
    toast.success('Modelo creado');
  });

  const handleActualizar = actualizarForm.handleSubmit(async ({ id, ...data }) => {
    await actualizarLog.execute('PUT', `/modelos/${id}`, data, () => modelosApi.actualizar(id, data));
    toast.success('Modelo actualizado');
  });

  const handleEliminar = eliminarForm.handleSubmit(async ({ id }) => {
    await eliminarLog.execute('DELETE', `/modelos/${id}`, undefined, () => modelosApi.eliminar(id));
    toast.success('Modelo eliminado');
  });

  return (
    <div>
      <PageHeader title="Modelos" subtitle="CRUD completo de modelos de vehículos." badge="5 endpoints" />

      <div className="space-y-4 max-w-2xl">
        {/* Listar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/modelos</code>
            </div>
            <button onClick={handleListar} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
              {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          {modelos.length > 0 && (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'nombre', label: 'Nombre' },
                { key: 'anio', label: 'Año' },
                { key: 'tipoModelo', label: 'Tipo' },
                { key: 'marcaId', label: 'Marca ID' },
                { key: 'activo', label: 'Activo', render: r => (r.activo ? '✅' : '❌') },
              ]}
              data={modelos as unknown as Record<string, unknown>[]}
            />
          )}
          <ApiResponseCard log={listarLog.log} />
        </div>

        {/* Obtener por ID */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/modelos/{'{id}'}</code>
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
              <code className="text-sm font-mono text-slate-700">/modelos</code>
            </div>
            <button onClick={handleCrear} disabled={crearLog.loading} className="btn-primary flex items-center gap-2">
              {crearLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nombre *</label>
              <input {...crearForm.register('nombre')} className="input" placeholder="Corolla" />
            </div>
            <div>
              <label className="label">Año</label>
              <input {...crearForm.register('anio', { valueAsNumber: true })} type="number" className="input" placeholder="2024" />
            </div>
            <div>
              <label className="label">Tipo de modelo</label>
              <select {...crearForm.register('tipoModelo')} className="input">
                <option value="">— Seleccionar —</option>
                {TIPOS_MODELO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Marca ID</label>
              <input {...crearForm.register('marcaId', { valueAsNumber: true })} type="number" className="input" placeholder="1" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input {...crearForm.register('activo')} type="checkbox" id="activo-crear" className="rounded" />
              <label htmlFor="activo-crear" className="text-sm text-slate-700">Activo</label>
            </div>
          </div>
          <ApiResponseCard log={crearLog.log} />
        </div>

        {/* Actualizar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-put">PUT</span>
              <code className="text-sm font-mono text-slate-700">/modelos/{'{id}'}</code>
            </div>
            <button onClick={handleActualizar} disabled={actualizarLog.loading} className="btn-primary flex items-center gap-2">
              {actualizarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">ID</label>
              <input {...actualizarForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" />
            </div>
            <div>
              <label className="label">Nombre</label>
              <input {...actualizarForm.register('nombre')} className="input" placeholder="Corolla" />
            </div>
            <div>
              <label className="label">Año</label>
              <input {...actualizarForm.register('anio', { valueAsNumber: true })} type="number" className="input" />
            </div>
            <div>
              <label className="label">Tipo de modelo</label>
              <select {...actualizarForm.register('tipoModelo')} className="input">
                <option value="">— Seleccionar —</option>
                {TIPOS_MODELO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Marca ID</label>
              <input {...actualizarForm.register('marcaId', { valueAsNumber: true })} type="number" className="input" />
            </div>
          </div>
          <ApiResponseCard log={actualizarLog.log} />
        </div>

        {/* Eliminar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-delete">DELETE</span>
              <code className="text-sm font-mono text-slate-700">/modelos/{'{id}'}</code>
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
