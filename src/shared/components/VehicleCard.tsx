import { useNavigate } from 'react-router-dom';
import { Fuel, Gauge, Settings2, Heart } from 'lucide-react';
import { formatPrice, combustibleLabel, transmisionLabel, estadoBadge, estadoLabel } from '../utils/format';
import type { Vehiculo } from '../../types/vehiculo';
import { useAuthStore } from '../../store/authStore';
import { useFavoritosMutation } from '../hooks/useFavoritos';

interface Props {
  vehiculo: Vehiculo;
  showStatus?: boolean;
}

export default function VehicleCard({ vehiculo, showStatus }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { agregar } = useFavoritosMutation();

  return (
    <div className="card-vehicle group" onClick={() => navigate(`/vehiculos/${vehiculo.id}`)}>
      <div className="relative overflow-hidden h-52 bg-slate-100">
        {vehiculo.imagenPrincipalUrl
          ? (
            <img
              src={vehiculo.imagenPrincipalUrl}
              alt={vehiculo.modeloNombre}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          )
          : <div className="w-full h-full flex items-center justify-center text-slate-300"><Settings2 size={48} /></div>
        }
        {showStatus && (
          <span className={`absolute top-3 left-3 ${estadoBadge[vehiculo.estado]}`}>{estadoLabel[vehiculo.estado]}</span>
        )}
        {isAuthenticated && user?.rol === 'ROLE_CLIENTE' && (
          <button
            onClick={e => { e.stopPropagation(); agregar.mutate(vehiculo.id); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow"
          >
            <Heart size={15} className="text-slate-600" />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-[#0f0f0f] leading-tight">{vehiculo.modeloNombre ?? 'Vehículo'} {vehiculo.anio}</h3>
        <p className="text-2xl font-bold text-[#0f0f0f] mt-2">{formatPrice(vehiculo.precioVenta)}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Gauge size={12} /> {vehiculo.kilometraje?.toLocaleString()} km</span>
          <span className="flex items-center gap-1"><Fuel size={12} /> {combustibleLabel[vehiculo.tipoCombustible] ?? vehiculo.tipoCombustible}</span>
          <span className="flex items-center gap-1"><Settings2 size={12} /> {transmisionLabel[vehiculo.tipoTransmision] ?? vehiculo.tipoTransmision}</span>
        </div>
      </div>
    </div>
  );
}
