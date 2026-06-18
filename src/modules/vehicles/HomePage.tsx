import { Link } from 'react-router-dom';
import { useVehiculosBusqueda } from '../../shared/hooks/useVehiculos';
import { useMarcas } from '../../shared/hooks/useMarcas';
import VehicleCard from '../../shared/components/VehicleCard';
import Spinner from '../../shared/components/Spinner';
import { ArrowRight, Shield, Award, Headphones } from 'lucide-react';
import type { Vehiculo } from '../../types/vehiculo';

export default function HomePage() {
  const { data: disponibles, isLoading: loadDisp } = useVehiculosBusqueda({ estado: 'DISPONIBLE', page: 0 });
  
  const { data: marcasData } = useMarcas();

  const vehiculos: (Vehiculo & { marcaNombre?: string; modeloNombre?: string; imagenUrl?: string })[] =
    Array.isArray(disponibles) ? disponibles.slice(0, 8) :
    Array.isArray(disponibles?.content) ? disponibles.content.slice(0, 8) : [];

  const marcas = Array.isArray(marcasData) ? marcasData.slice(0, 8) :
    Array.isArray(marcasData?.content) ? marcasData.content.slice(0, 8) : [];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] bg-[#0f0f0f] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #c9a84c 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-[#c9a84c] text-sm font-display font-semibold uppercase tracking-widest mb-4">
              Concesionaria Premium
            </p>
            <h1 className="font-display font-bold text-5xl md:text-7xl text-white leading-[1.05] tracking-tight">
              Tu próximo<br />
              <span className="text-[#c9a84c]">vehículo</span><br />
              te espera
            </h1>
            <p className="text-white/50 text-lg mt-6 font-body leading-relaxed max-w-lg">
              Encontrá el auto ideal entre nuestro exclusivo catálogo de vehículos seleccionados. Calidad y confianza garantizada.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/vehiculos" className="btn-gold flex items-center gap-2">
                Ver catálogo <ArrowRight size={16} />
              </Link>
              <Link to="/registro" className="btn-outline text-white border-white/20 hover:bg-white hover:text-[#0f0f0f]">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#c9a84c]">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 text-center">
          {[
            { n: '500+', label: 'Vehículos vendidos' },
            { n: '15+', label: 'Años de experiencia' },
            { n: '100%', label: 'Satisfacción garantizada' },
          ].map(({ n, label }) => (
            <div key={label}>
              <p className="font-display font-bold text-2xl text-[#0f0f0f]">{n}</p>
              <p className="text-[#0f0f0f]/60 text-xs font-body mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-2">Catálogo</p>
            <h2 className="section-title">Vehículos disponibles</h2>
          </div>
          <Link to="/vehiculos" className="btn-outline btn-sm flex items-center gap-1.5">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {loadDisp ? (
          <Spinner size={40} className="py-16" />
        ) : vehiculos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehiculos.map(v => <VehicleCard key={v.id} vehiculo={v} />)}
          </div>
        ) : (
          <p className="text-center text-slate-400 py-16">No hay vehículos disponibles en este momento.</p>
        )}
      </section>

      {/* Brands */}
      {marcas.length > 0 && (
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-8">Marcas disponibles</p>
            <div className="flex flex-wrap justify-center gap-4">
              {marcas.map((m: { id: number; nombre: string }) => (
                <Link
                  key={m.id}
                  to={`/vehiculos?marcaId=${m.id}`}
                  className="px-6 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-[#c9a84c] text-sm font-display font-semibold tracking-wide transition-all rounded-sm"
                >
                  {m.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-2">¿Por qué elegirnos?</p>
          <h2 className="section-title">Experiencia premium</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Garantía total', desc: 'Todos nuestros vehículos pasan por una revisión técnica completa antes de ser publicados.' },
            { icon: Award, title: 'Calidad certificada', desc: 'Trabajamos con las mejores marcas y garantizamos la procedencia de cada unidad.' },
            { icon: Headphones, title: 'Asesoramiento 360°', desc: 'Nuestros vendedores te acompañan en todo el proceso de compra, sin presiones.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6">
              <div className="w-14 h-14 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Icon size={24} className="text-[#c9a84c]" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#c9a84c] py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="font-display font-bold text-3xl text-[#0f0f0f] mb-4">¿Listo para encontrar tu auto?</h2>
          <p className="text-[#0f0f0f]/60 mb-8">Explorá nuestro catálogo completo y encontrá el vehículo que se adapta a tu estilo.</p>
          <Link to="/vehiculos" className="btn-dark inline-flex items-center gap-2">
            Explorar catálogo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
