import { useReporteStock, useReporteUltimos } from '../../shared/hooks/useVehiculos';
import StatCard from '../../shared/components/StatCard';
import Spinner from '../../shared/components/Spinner';
import { formatPrice } from '../../shared/utils/format';
import { Car, CheckCircle, Clock, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Vehiculo } from '../../types/vehiculo';

export default function DashboardPage() {
  const { data: stock, isLoading: ls } = useReporteStock();
  const { data: ultimos, isLoading: lu } = useReporteUltimos();
  const navigate = useNavigate();

  const s = stock as Record<string, number> ?? {};
  const ultimosList: (Vehiculo & { marcaNombre?: string; modeloNombre?: string })[] =
    Array.isArray(ultimos) ? ultimos.slice(0, 5) : ultimos?.content?.slice(0, 5) ?? [];

  if (ls || lu) return <Spinner size={36} className="py-24" />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen operativo de la concesionaria</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Disponibles" value={s.disponibles ?? s.cantidadDisponible ?? '—'} icon={<CheckCircle size={28} />} color="text-emerald-600" />
        <StatCard label="Reservados" value={s.reservados ?? s.cantidadReservado ?? '—'} icon={<Clock size={28} />} color="text-amber-600" />
        <StatCard label="Vendidos" value={s.vendidos ?? s.cantidadVendido ?? '—'} icon={<Car size={28} />} color="text-slate-600" />
        <StatCard label="Stock total" value={s.total ?? s.cantidadTotal ?? '—'} icon={<Package size={28} />} />
      </div>

      {/* Últimos vehículos */}
      <div className="card-admin p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-800">Últimos vehículos ingresados</h2>
          <button onClick={() => navigate('/admin/vehiculos')} className="text-xs text-[#c9a84c] hover:underline font-semibold">
            Ver todos →
          </button>
        </div>
        {lu ? <Spinner /> : (
          <div className="space-y-3">
            {ultimosList.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Sin datos</p>
            ) : ultimosList.map(v => (
              <div key={v.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-semibold text-sm">{v.marcaNombre} {v.modeloNombre} {v.anio}</p>
                  <p className="text-xs text-slate-400">{v.patente} · {v.estado}</p>
                </div>
                <p className="font-bold text-sm text-[#c9a84c]">{formatPrice(v.precioVenta)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
