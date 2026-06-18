import { useFavoritos, useFavoritosMutation } from '../../shared/hooks/useFavoritos';
import Spinner from '../../shared/components/Spinner';
import EmptyState from '../../shared/components/EmptyState';
import { formatPrice } from '../../shared/utils/format';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FavoritosPage() {
  const { data, isLoading } = useFavoritos();
  const { eliminar } = useFavoritosMutation();
  const navigate = useNavigate();
  const lista = Array.isArray(data) ? data : data?.content ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-1">Mi cuenta</p>
        <h1 className="section-title flex items-center gap-3"><Heart size={28} /> Mis favoritos</h1>
      </div>

      {isLoading ? <Spinner size={36} className="py-16" /> : lista.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} />}
          title="No tenés favoritos aún"
          description="Guardá los vehículos que te interesen y encontralos acá fácilmente."
          action={<button onClick={() => navigate('/vehiculos')} className="btn-gold btn-sm flex items-center gap-2">Ver catálogo <ArrowRight size={14} /></button>}
        />
      ) : (
        <div className="space-y-4">
          {lista.map((fav: Record<string, unknown>) => (
            <div key={fav.id as number} className="bg-white border border-[#e8e8e8] rounded-sm p-5 flex items-center gap-5 hover:border-[#c9a84c] transition-colors">
              <div className="w-24 h-20 bg-slate-100 rounded overflow-hidden shrink-0">
                {fav.imagenUrl ? (
                  <img src={fav.imagenUrl as string} alt="" className="w-full h-full object-cover" />
                ) : <div className="w-full h-full bg-slate-200" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#c9a84c] font-semibold">{fav.marcaNombre as string}</p>
                <p className="font-display font-bold text-lg truncate">{fav.modeloNombre as string} {fav.anio as number}</p>
                <p className="text-lg font-bold mt-1">{fav.precioVenta ? formatPrice(fav.precioVenta as number) : '—'}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => navigate(`/vehiculos/${fav.vehiculoId ?? fav.id}`)} className="btn-outline btn-sm flex items-center gap-1.5">
                  Ver <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => eliminar.mutate(fav.vehiculoId as number ?? fav.id as number)}
                  disabled={eliminar.isPending}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
