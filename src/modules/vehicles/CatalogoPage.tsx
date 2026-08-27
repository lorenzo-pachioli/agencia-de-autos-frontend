import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useVehiculosBusqueda } from '../../shared/hooks/useVehiculos';
import { useMarcas } from '../../shared/hooks/useMarcas';
import { useModelos } from '../../shared/hooks/useModelos';
import VehicleCard from '../../shared/components/VehicleCard';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import type { VehiculoFiltros } from '../../types/vehiculo';
import { Search, SlidersHorizontal, X, Car } from 'lucide-react';
import type { Vehiculo } from '../../types/vehiculo';

const COMBUSTIBLES = ['NAFTA', 'DIESEL', 'ELECTRICO', 'HIBRIDO', 'GNC'];
const TRANSMISIONES = ['MANUAL', 'AUTOMATICA'];

export default function CatalogoPage() {
  const [searchParams] = useSearchParams();
  const [filtros, setFiltros] = useState<VehiculoFiltros>({
    estado: 'DISPONIBLE',
    marcaId: searchParams.get('marcaId') ? Number(searchParams.get('marcaId')) : undefined,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading, isFetching } = useVehiculosBusqueda(filtros);
  const { data: marcasData } = useMarcas();
  const { data: modelosData } = useModelos();

  const { register, handleSubmit, reset } = useForm<VehiculoFiltros>({
    defaultValues: filtros,
  });

  const marcas = Array.isArray(marcasData) ? marcasData : marcasData?.content ?? [];
  const modelos = Array.isArray(modelosData) ? modelosData : modelosData?.content ?? [];
  const vehiculos: Vehiculo[] =
    Array.isArray(data)
      ? data
      : data?.content ?? [];

  const onFiltrar = handleSubmit((vals) => {
    const clean: VehiculoFiltros = { estado: 'DISPONIBLE' };
    if (vals.marcaId) clean.marcaId = Number(vals.marcaId);
    if (vals.modeloId) clean.modeloId = Number(vals.modeloId);
    if (vals.combustible) clean.combustible = vals.combustible;
    if (vals.tipoTransmision) clean.tipoTransmision = vals.tipoTransmision;
    if (vals.minPrecio) clean.minPrecio = Number(vals.minPrecio);
    if (vals.maxPrecio) clean.maxPrecio = Number(vals.maxPrecio);
    setFiltros(clean);
    setSidebarOpen(false);
  });

  const limpiar = () => { reset(); setFiltros({ estado: 'DISPONIBLE' }); };

  const FilterPanel = () => (
    <form onSubmit={onFiltrar} className="space-y-5">
      <div>
        <label className="label-field">Marca</label>
        <select {...register('marcaId')} className="input-field text-sm">
          <option value="">Todas las marcas</option>
          {marcas.map((m: { id: number; nombre: string }) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-field">Modelo</label>
        <select {...register('modeloId')} className="input-field text-sm">
          <option value="">Todos los modelos</option>
          {modelos.map((m: { id: number; nombre: string }) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-field">Combustible</label>
        <select {...register('combustible')} className="input-field text-sm">
          <option value="">Todos</option>
          {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label-field">Transmisión</label>
        <select {...register('tipoTransmision')} className="input-field text-sm">
          <option value="">Todas</option>
          {TRANSMISIONES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="label-field">Precio mínimo</label>
        <input {...register('minPrecio')} type="number" placeholder="$ 0" className="input-field text-sm" />
      </div>
      <div>
        <label className="label-field">Precio máximo</label>
        <input {...register('maxPrecio')} type="number" placeholder="Sin límite" className="input-field text-sm" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-gold flex-1 flex items-center justify-center gap-2">
          <Search size={15} /> Filtrar
        </button>
        <button type="button" onClick={limpiar} className="btn-outline btn-sm flex items-center gap-1">
          <X size={14} />
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-1">Catálogo</p>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <h1 className="section-title">Vehículos disponibles</h1>
            {isFetching && !isLoading && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Actualizando datos...
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden btn-outline btn-sm flex items-center gap-2"
          >
            <SlidersHorizontal size={15} /> Filtros
          </button>
        </div>
        {vehiculos.length > 0 && (
          <p className="text-slate-500 text-sm mt-1">{vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} encontrado{vehiculos.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar filtros desktop */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20 bg-white border border-[#e8e8e8] p-6 rounded-sm">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-5 flex items-center gap-2">
              <SlidersHorizontal size={14} /> Filtros
            </h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile filtros overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold">Filtros</h3>
                <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1">
          {isLoading ? (
            <Spinner size={40} className="py-24" />
          ) : vehiculos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehiculos.map(v => <VehicleCard key={v.id} vehiculo={v} />)}
            </div>
          ) : (
            <EmptyState
              icon={<Car size={48} />}
              title="Sin resultados"
              description="No encontramos vehículos con los filtros aplicados. Intentá con otros criterios."
              action={<button onClick={limpiar} className="btn-gold btn-sm">Limpiar filtros</button>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
