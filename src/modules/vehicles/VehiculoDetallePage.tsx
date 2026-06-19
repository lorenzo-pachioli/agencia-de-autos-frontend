import { useParams, useNavigate } from 'react-router-dom';
import { useVehiculo } from '../../shared/hooks/useVehiculos';
import { useFavoritosMutation } from '../../shared/hooks/useFavoritos';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../shared/components/Spinner';
import { formatPrice, combustibleLabel, transmisionLabel, estadoBadge, estadoLabel } from '../../shared/utils/format';
import { Heart, ArrowLeft, Gauge, Fuel, Settings2, Calendar, Palette } from 'lucide-react';
import type { Vehiculo } from '../../types/vehiculo';
import { ROLES } from '../../types/auth';
import { useState } from 'react';

export default function VehiculoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useVehiculo(Number(id));

  const { isAuthenticated, user } = useAuthStore();
  const { agregar } = useFavoritosMutation();
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);


  if (isLoading) return <Spinner size={40} className="py-40" />;
  if (!data) return (
    <div className="text-center py-40 text-slate-400">Vehículo no encontrado</div>
  );

  const v = data as Vehiculo;
  const imagenes = [
    v.imagenPrincipalUrl,
    ...(v.imagenes ?? []).filter(img => img !== v.imagenPrincipalUrl)
  ].filter(Boolean);

  console.log(imagenes);


  const specs = [
    { icon: Calendar, label: 'Año', value: v.anio },
    { icon: Gauge, label: 'Kilometraje', value: `${v.kilometraje?.toLocaleString('es-AR')} km` },
    { icon: Fuel, label: 'Combustible', value: combustibleLabel[v.tipoCombustible] ?? v.tipoCombustible },
    { icon: Settings2, label: 'Transmisión', value: transmisionLabel[v.tipoTransmision] ?? v.tipoTransmision },
    { icon: Palette, label: 'Color', value: v.color },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
        <ArrowLeft size={16} /> Volver al catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Columna imágenes */}
        <div>
          <div className="aspect-[4/3] bg-slate-100 rounded-sm overflow-hidden">
            {imagenes.length > 0 ? (
              <img
                src={imagenes[imagenSeleccionada]}
                alt={v.modeloNombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Settings2 size={64} />
              </div>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {imagenes.map((img, i) => (
                <button
                  key={`${i}-${img}`}
                  type="button"
                  onClick={() => setImagenSeleccionada(i)}
                  className={`aspect-square overflow-hidden rounded border-2 ${imagenSeleccionada === i
                    ? 'border-[#c9a84c]'
                    : 'border-transparent'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${v.modeloNombre}-${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna información */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <span className={`${estadoBadge[v.estado]} text-xs`}>
              {estadoLabel[v.estado]}
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl text-[#0f0f0f] leading-tight">
            {v.modeloNombre} {v.anio}
          </h1>

          <p className="text-3xl font-bold text-[#0f0f0f] mt-4">
            {formatPrice(v.precioVenta)}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-8">
            {specs.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm"
              >
                <Icon size={16} className="text-[#c9a84c] shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="font-semibold text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {v.descripcion && (
            <div className="mt-8">
              <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-3">
                Descripción
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {v.descripcion}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {isAuthenticated && user?.rol === ROLES.CLIENTE && (
              <button
                onClick={() => agregar.mutate(v.id)}
                disabled={agregar.isPending}
                className="w-full btn-outline flex items-center justify-center gap-2"
              >
                <Heart size={16} />
                {agregar.isPending ? 'Agregando…' : 'Agregar a favoritos'}
              </button>
            )}

            {isAuthenticated ? (
              <button
                type="button"
                className="w-full btn-gold flex items-center justify-center"
              >
                Solicitar Reserva
              </button>
            ) : (
              <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-sm px-4 py-3 text-center">
                <p className="text-sm text-slate-600">
                  ¿Te interesa este vehículo?{' '}
                  <a
                    href="/login"
                    className="text-[#c9a84c] font-semibold hover:underline"
                  >
                    Iniciá sesión
                  </a>{' '}
                  o{' '}
                  <a
                    href="/registro"
                    className="text-[#c9a84c] font-semibold hover:underline"
                  >
                    creá tu cuenta
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
