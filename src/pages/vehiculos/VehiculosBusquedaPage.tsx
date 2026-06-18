import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { vehiculosApi } from '../../api/vehiculos.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import type { VehiculoFiltros, Vehiculo } from '../../types/vehiculo';
import { Loader2, X } from 'lucide-react';

const ESTADOS = ['DISPONIBLE', 'RESERVADO', 'VENDIDO', 'EN_REPARACION'];
const COMBUSTIBLES = ['NAFTA', 'DIESEL', 'ELECTRICO', 'HIBRIDO', 'GNC'];
const TRANSMISIONES = ['MANUAL', 'AUTOMATICA'];

export default function VehiculosBusquedaPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const { log, loading, execute } = useRequestLog();
  const { register, handleSubmit, reset } = useForm<VehiculoFiltros>();

  const handleBusqueda = handleSubmit(async (data) => {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    ) as VehiculoFiltros;

    const res = await execute('GET', '/vehiculos/busqueda', clean, () => vehiculosApi.busqueda(clean));
    if (Array.isArray(res)) setVehiculos(res);
    else if (res && Array.isArray((res as { content?: Vehiculo[] }).content)) setVehiculos((res as { content: Vehiculo[] }).content);
    else setVehiculos([]);
  });

  return (
    <div>
      <PageHeader title="Búsqueda Avanzada" subtitle="Filtrá vehículos por múltiples criterios." badge="GET /vehiculos/busqueda" />

      <div className="max-w-2xl space-y-4">
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-slate-700 text-sm">Filtros de búsqueda</p>
            <button onClick={() => reset()} className="btn-secondary flex items-center gap-1 text-xs py-1">
              <X size={12} /> Limpiar
            </button>
          </div>

          <form onSubmit={handleBusqueda} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Marca ID</label>
                <input {...register('marcaId', { valueAsNumber: true })} type="number" className="input" placeholder="Ej: 1" />
              </div>
              <div>
                <label className="label">Modelo ID</label>
                <input {...register('modeloId', { valueAsNumber: true })} type="number" className="input" placeholder="Ej: 1" />
              </div>
              <div>
                <label className="label">Estado</label>
                <select {...register('estado')} className="input">
                  <option value="">— Todos —</option>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Combustible</label>
                <select {...register('combustible')} className="input">
                  <option value="">— Todos —</option>
                  {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Transmisión</label>
                <select {...register('tipoTransmision')} className="input">
                  <option value="">— Todas —</option>
                  {TRANSMISIONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Color</label>
                <input {...register('color')} className="input" placeholder="Rojo" />
              </div>
              <div>
                <label className="label">Precio mínimo</label>
                <input {...register('minPrecio', { valueAsNumber: true })} type="number" className="input" placeholder="0" />
              </div>
              <div>
                <label className="label">Precio máximo</label>
                <input {...register('maxPrecio', { valueAsNumber: true })} type="number" className="input" placeholder="999999" />
              </div>
              <div>
                <label className="label">Página</label>
                <input {...register('page', { valueAsNumber: true })} type="number" className="input" placeholder="0" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />} Buscar
            </button>
          </form>
        </div>

        {vehiculos.length > 0 && (
          <div className="card p-4">
            <p className="text-sm font-semibold text-slate-600 mb-3">{vehiculos.length} resultado(s)</p>
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'patente', label: 'Patente' },
                { key: 'anio', label: 'Año' },
                { key: 'color', label: 'Color' },
                { key: 'estado', label: 'Estado' },
                { key: 'tipoCombustible', label: 'Combustible' },
                { key: 'precioVenta', label: 'Precio', render: r => `$${Number(r.precioVenta).toLocaleString()}` },
              ]}
              data={vehiculos as unknown as Record<string, unknown>[]}
            />
          </div>
        )}

        <ApiResponseCard log={log} />
      </div>
    </div>
  );
}
