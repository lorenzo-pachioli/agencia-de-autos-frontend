import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../types/auth';
import { Car, Heart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
    console.log('user', user);
  }, [isAuthenticated, user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#c9a84c] rounded flex items-center justify-center">
            <Car size={16} className="text-[#0f0f0f]" />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">AutoElite</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/vehiculos" className="text-sm text-white/70 hover:text-white font-body transition-colors">Catálogo</Link>
          {isAuthenticated && user?.rol === ROLES.CLIENTE && (
            <Link to="/favoritos" className="text-sm text-white/70 hover:text-white font-body transition-colors flex items-center gap-1.5">
              <Heart size={14} /> Favoritos
            </Link>
          )}
          {(user?.rol === ROLES.VENDEDOR || user?.rol === ROLES.ADMINISTRADOR) && (
            <Link to="/admin" className="text-sm text-white/70 hover:text-white font-body transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={14} /> Panel
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-ghost text-white/70 hover:text-white">Iniciar sesión</Link>
              <Link to="/registro" className="btn-gold btn-sm">Registrarse</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/mi-cuenta" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center">
                  <User size={13} className="text-[#0f0f0f]" />
                </div>
                <span>{user?.nombre ?? user?.email}</span>
              </Link>
              <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-white/5 px-6 py-4 space-y-3">
          <Link to="/vehiculos" onClick={() => setOpen(false)} className="block text-sm text-white/70">Catálogo</Link>
          {isAuthenticated && user?.rol === ROLES.CLIENTE && (
            <Link to="/favoritos" onClick={() => setOpen(false)} className="block text-sm text-white/70">Favoritos</Link>
          )}
          {(user?.rol === ROLES.VENDEDOR || user?.rol === ROLES.ADMINISTRADOR) && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block text-sm text-white/70">Panel Admin</Link>
          )}
          {!isAuthenticated ? (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-white/70">Iniciar sesión</Link>
              <Link to="/registro" onClick={() => setOpen(false)} className="btn-gold btn-sm">Registrarse</Link>
            </div>
          ) : (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="text-sm text-white/70 flex items-center gap-2">
              <LogOut size={14} /> Cerrar sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}
