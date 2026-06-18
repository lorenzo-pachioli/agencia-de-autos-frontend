import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { vehiculosApi } from '../../api/vehiculos.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import type { Vehiculo } from '../../types/vehiculo';
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Search, BarChart2 } from 'lucide-react';

const ESTADOS = ['DISPONIBLE', 'RESERVADO', 'VENDIDO', 'EN_REPARACION'];
const COMBUSTIBLES = ['NAFTA', 'DIESEL', 'ELECTRICO', 'HIBRIDO', 'GNC'];
const TRANSMISIONES = ['MANUAL', 'AUTOMATICA'];

const vehiculoFields = (register: UseFormRegister<FieldValues>) => (
  <div className="grid grid-cols-2 gap-3">
    <div><label className="label">Patente</label><input {...register('patente')} className="input" placeholder="ABC123" /></div>
    <div><label className="label">Año</label><input {...register('anio', { valueAsNumber: true })} type="number" className="input" placeholder="2024" /></div>
    <div><label className="label">Precio Adquisición</label><input {...register('precioAdquisicion', { valueAsNumber: true })} type="number" className="input" placeholder="0" /></div>
    <div><label className="label">Precio Venta</label><input {...register('precioVenta', { valueAsNumber: true })} type="number" className="input" placeholder="0" /></div>
    <div><label className="label">Modelo ID</label><input {...register('modeloId', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
    <div><label className="label">Kilometraje</label><input {...register('kilometraje', { valueAsNumber: true })} type="number" className="input" placeholder="0" /></div>
    <div><label className="label">Color</label><input {...register('color')} className="input" placeholder="Rojo" /></div>
    <div>
      <label className="label">Estado</label>
      <select {...register('estado')} className="input">
        <option value="">— Seleccionar —</option>
        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
      </select>
    </div>
    <div>
      <label className="label">Transmisión</label>
      <select {...register('tipoTransmision')} className="input">
        <option value="">— Seleccionar —</option>
        {TRANSMISIONES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
    <div>
      <label className="label">Combustible</label>
      <select {...register('tipoCombustible')} className="input">
        <option value="">— Seleccionar —</option>
        {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div className="col-span-2"><label className="label">Descripción</label><textarea {...register('descripcion')} className="input resize-none" rows={2} placeholder="Descripción del vehículo..." /></div>
  </div>
);

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const listarLog = useRequestLog();
  const obtenerLog = useRequestLog();
  const crearLog = useRequestLog();
  const actualizarLog = useRequestLog();
  const eliminarLog = useRequestLog();
  const estadoLog = useRequestLog();

  const obtenerForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });
  const crearForm = useForm({ defaultValues: { patente: '', anio: 2024, precioAdquisicion: 0, precioVenta: 0, modeloId: 0, kilometraje: 0, color: '', estado: '', tipoTransmision: '', tipoCombustible: '', descripcion: '' } });
  const actualizarForm = useForm({ defaultValues: { id: 0, patente: '', anio: 2024, precioAdquisicion: 0, precioVenta: 0, modeloId: 0, kilometraje: 0, color: '', estado: '', tipoTransmision: '', tipoCombustible: '', descripcion: '' } });
  const eliminarForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });
  const estadoForm = useForm<{ id: number; estado: string }>({ defaultValues: { id: 0, estado: '' } });

  const handleListar = async () => {
    const res = await listarLog.execute('GET', '/vehiculos', undefined, () => vehiculosApi.listar());
    if (Array.isArray(res)) setVehiculos(res);
    else if (res && Array.isArray((res as { content?: Vehiculo[] }).content)) setVehiculos((res as { content: Vehiculo[] }).content);
  };

  const handleObtener = obtenerForm.handleSubmit(async ({ id }) => {
    await obtenerLog.execute('GET', `/vehiculos/${id}`, undefined, () => vehiculosApi.obtener(id));
  });

  const handleCrear = crearForm.handleSubmit(async (data) => {
    await crearLog.execute('POST', '/vehiculos', data, () => vehiculosApi.crear(data));
    toast.success('Vehículo creado');
  });

  const handleActualizar = actualizarForm.handleSubmit(async ({ id, ...data }) => {
    await actualizarLog.execute('PUT', `/vehiculos/${id}`, data, () => vehiculosApi.actualizar(id, data));
    toast.success('Vehículo actualizado');
  });

  const handleEliminar = eliminarForm.handleSubmit(async ({ id }) => {
    await eliminarLog.execute('DELETE', `/vehiculos/${id}`, undefined, () => vehiculosApi.eliminar(id));
    toast.success('Vehículo eliminado');
  });

  const handleEstado = estadoForm.handleSubmit(async ({ id, estado }) => {
    await estadoLog.execute('PATCH', `/vehiculos/${id}/estado`, { estado }, () => vehiculosApi.cambiarEstado(id, estado));
    toast.success('Estado actualizado');
  });

  return (
    <div>
      <PageHeader title="Vehículos" subtitle="CRUD y gestión de estado de vehículos." badge="6 endpoints" />

      <div className="flex gap-3 mb-6">
        <Link to="/vehiculos/busqueda" className="btn-secondary flex items-center gap-2">
          <Search size={14} /> Búsqueda avanzada
        </Link>
        <Link to="/vehiculos/reportes" className="btn-secondary flex items-center gap-2">
          <BarChart2 size={14} /> Reportes
        </Link>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Listar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/vehiculos</code>
            </div>
            <button onClick={handleListar} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
              {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          {vehiculos.length > 0 && (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'patente', label: 'Patente' },
                { key: 'anio', label: 'Año' },
                { key: 'color', label: 'Color' },
                { key: 'estado', label: 'Estado' },
                { key: 'precioVenta', label: 'Precio Venta', render: r => `$${Number(r.precioVenta).toLocaleString()}` },
              ]}
              data={vehiculos as unknown as Record<string, unknown>[]}
            />
          )}
          <ApiResponseCard log={listarLog.log} />
        </div>

        {/* Obtener */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/vehiculos/{'{id}'}</code>
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
              <code className="text-sm font-mono text-slate-700">/vehiculos</code>
            </div>
            <button onClick={handleCrear} disabled={crearLog.loading} className="btn-primary flex items-center gap-2">
              {crearLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            {vehiculoFields(crearForm.register as UseFormRegister<FieldValues>)}
          </div>
          <ApiResponseCard log={crearLog.log} />
        </div>

        {/* Actualizar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-put">PUT</span>
              <code className="text-sm font-mono text-slate-700">/vehiculos/{'{id}'}</code>
            </div>
            <button onClick={handleActualizar} disabled={actualizarLog.loading} className="btn-primary flex items-center gap-2">
              {actualizarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <div>
              <label className="label">ID del vehículo</label>
              <input {...actualizarForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
            </div>
            {vehiculoFields(actualizarForm.register as UseFormRegister<FieldValues>)}
          </div>
          <ApiResponseCard log={actualizarLog.log} />
        </div>

        {/* Eliminar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-delete">DELETE</span>
              <code className="text-sm font-mono text-slate-700">/vehiculos/{'{id}'}</code>
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

        {/* Cambiar estado */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-patch">PATCH</span>
              <code className="text-sm font-mono text-slate-700">/vehiculos/{'{id}'}/estado</code>
            </div>
            <button onClick={handleEstado} disabled={estadoLog.loading} className="btn-primary flex items-center gap-2">
              {estadoLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="label">ID</label>
              <input {...estadoForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" />
            </div>
            <div>
              <label className="label">Nuevo estado</label>
              <select {...estadoForm.register('estado')} className="input">
                <option value="">— Seleccionar —</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <ApiResponseCard log={estadoLog.log} />
        </div>
      </div>
    </div>
  );
}
