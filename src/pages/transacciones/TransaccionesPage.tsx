import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { transaccionesApi } from '../../api/transacciones.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { type TransaccionFiltros, type Transaccion, type TransaccionCrearDTO, MetodoPago } from '../../types/transaccion';
import { Loader2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ESTADOS = ['PENDIENTE', 'SENIADA', 'VENDIDA', 'CANCELADA'];

export default function TransaccionesPage() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const listarLog = useRequestLog();
  const obtenerLog = useRequestLog();
  const crearLog = useRequestLog();
  const actualizarLog = useRequestLog();

  const filtrosForm = useForm<TransaccionFiltros>();
  const obtenerForm = useForm({ defaultValues: { id: 0 } });
  const actualizarForm = useForm({ defaultValues: { id: 0, vehiculo_id: 0, cliente_id: 0, vendedor_id: 0, precio_final: 0, estadoTransaccion: 'RESERVA', metodoPago: '', observaciones: '' } });
  const crearForm = useForm<TransaccionCrearDTO>({
    defaultValues: {
      vehiculo_id: 0,
      cliente_id: 0,
      vendedor_id: 0,
      precio_final: 0,
      estadoTransaccion: 'RESERVA',
      metodoPago: 'EFECTIVO',
      observaciones: ''
    }
  });

  const handleListar = filtrosForm.handleSubmit(async (data) => {
    const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== undefined && v !== null)) as TransaccionFiltros;
    const res = await listarLog.execute('GET', '/transacciones', clean, () => transaccionesApi.listar(clean));
    if (Array.isArray(res)) setTransacciones(res);
    else if (res && Array.isArray((res as { content?: Transaccion[] }).content)) setTransacciones((res as { content: Transaccion[] }).content);
  });

  const handleObtener = obtenerForm.handleSubmit(async ({ id }) => {
    await obtenerLog.execute('GET', `/transacciones/${id}`, undefined, () => transaccionesApi.obtener(id));
  });

  const handleCrear = crearForm.handleSubmit(async (data) => {
    await crearLog.execute('POST', '/transacciones', data, () => transaccionesApi.crear(data));
    toast.success('Transacción creada');
  });

  const handleActualizar = actualizarForm.handleSubmit(async ({ id, ...data }) => {
    await actualizarLog.execute('PUT', `/transacciones/${id}`, data, () => transaccionesApi.actualizar(id, data));
    toast.success('Transacción actualizada');
  });

  return (
    <div>
      <PageHeader title="Transacciones" subtitle="Gestión de transacciones de compra-venta." badge="4 endpoints" />

      <div className="flex gap-3 mb-6">
        <Link to="/transacciones/acciones" className="btn-secondary flex items-center gap-2">
          <Zap size={14} /> Acciones especiales
        </Link>
      </div>

      <div className="space-y-4 max-w-2xl">

        {/* Listar con filtros */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/transacciones</code></div>
            <button onClick={handleListar} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
              {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div><label className="label">Vehículo ID</label><input {...filtrosForm.register('vehiculo_id', { valueAsNumber: true })} type="number" className="input" placeholder="Opcional" /></div>
            <div><label className="label">Cliente ID</label><input {...filtrosForm.register('cliente_id', { valueAsNumber: true })} type="number" className="input" placeholder="Opcional" /></div>
            <div><label className="label">Vendedor ID</label><input {...filtrosForm.register('vendedor_id', { valueAsNumber: true })} type="number" className="input" placeholder="Opcional" /></div>
            <div>
              <label className="label">Estado</label>
              <select {...filtrosForm.register('estadoTransaccion')} className="input">
                <option value="">— Todos —</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div><label className="label">Fecha desde</label><input {...filtrosForm.register('fechaDesde')} type="date" className="input" /></div>
            <div><label className="label">Fecha hasta</label><input {...filtrosForm.register('fechaHasta')} type="date" className="input" /></div>
            <div><label className="label">Página</label><input {...filtrosForm.register('page', { valueAsNumber: true })} type="number" className="input" placeholder="0" /></div>
          </div>
          {transacciones.length > 0 && (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'patente', label: 'Patente' },
                { key: 'clienteEmail', label: 'Cliente' },
                { key: 'vendedorEmail', label: 'Vendedor' },
                { key: 'estado', label: 'Estado' },
                { key: 'precio_final', label: 'Precio', render: r => r.precio_final ? `$${Number(r.precio_final).toLocaleString()}` : '—' },
              ]}
              data={transacciones as unknown as Record<string, unknown>[]}
            />
          )}
          <ApiResponseCard log={listarLog.log} />
        </div>

        {/* Obtener por ID */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-get">GET</span><code className="text-sm font-mono text-slate-700">/transacciones/{'{id}'}</code></div>
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
            <div className="flex items-center gap-2"><span className="badge-post">POST</span><code className="text-sm font-mono text-slate-700">/transacciones</code></div>
            <button onClick={handleCrear} disabled={crearLog.loading} className="btn-primary flex items-center gap-2">
              {crearLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div><label className="label">Vehículo ID</label><input {...crearForm.register('vehiculo_id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Cliente ID</label><input {...crearForm.register('cliente_id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Vendedor ID</label><input {...crearForm.register('vendedor_id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Precio Venta</label><input {...crearForm.register('precio_final', { valueAsNumber: true })} type="number" className="input" placeholder="0" /></div>
            <div className="col-span-2">
              <label className="label">Estado inicial</label>
              <select {...crearForm.register('estadoTransaccion')} className="input">
                <option value="">— Seleccionar —</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <ApiResponseCard log={crearLog.log} />
        </div>

        {/* Actualizar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="badge-put">PUT</span><code className="text-sm font-mono text-slate-700">/transacciones/{'{id}'}</code></div>
            <button onClick={handleActualizar} disabled={actualizarLog.loading} className="btn-primary flex items-center gap-2">
              {actualizarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="label">ID de transacción</label><input {...actualizarForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Vehículo ID</label><input {...actualizarForm.register('vehiculo_id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Cliente ID</label><input {...actualizarForm.register('cliente_id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Vendedor ID</label><input {...actualizarForm.register('vendedor_id', { valueAsNumber: true })} type="number" className="input" placeholder="1" /></div>
            <div><label className="label">Precio Venta</label><input {...actualizarForm.register('precio_final', { valueAsNumber: true })} type="number" className="input" placeholder="0" /></div>
            <div className="col-span-2">
              <label className="label">Estado</label>
              <select {...actualizarForm.register('estadoTransaccion')} className="input">
                <option value="">— Seleccionar —</option>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Método de pago</label>
              <select {...actualizarForm.register('metodoPago')} className="input">
                <option value="">— Seleccionar —</option>
                {MetodoPago.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <ApiResponseCard log={actualizarLog.log} />
        </div>

      </div>
    </div>
  );
}
