import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Car, Tag, Layers, Image,
  ReceiptText, Users, BarChart2, ClipboardList,
  LogOut, ChevronRight, Car as CarIcon,
} from 'lucide-react';

interface NavItem { to: string; label: string; icon: React.ElementType; adminOnly?: boolean; }

const items: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/vehiculos', label: 'Vehículos', icon: Car },
  { to: '/admin/marcas', label: 'Marcas', icon: Tag },
  { to: '/admin/modelos', label: 'Modelos', icon: Layers },
  { to: '/admin/imagenes', label: 'Imágenes', icon: Image },
  { to: '/admin/transacciones', label: 'Transacciones', icon: ReceiptText },
  { to: '/admin/reportes', label: 'Reportes', icon: BarChart2 },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, adminOnly: true },
  { to: '/admin/auditoria', label: 'Auditoría', icon: ClipboardList, adminOnly: true },
  { to: '/vehiculos', label: 'Catálogo', icon: CarIcon }
];

export default function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const visible = items.filter(i => !i.adminOnly || user?.rol === 'ROLE_ADMINISTRADOR');

  return (
    <aside className="w-60 min-h-screen bg-[#0f0f0f] flex flex-col border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#c9a84c] rounded flex items-center justify-center">
            <CarIcon size={15} className="text-[#0f0f0f]" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-sm leading-none">AutoElite</p>
            <p className="text-white/30 text-xs mt-0.5 capitalize">{user?.rol?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visible.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${isActive
                ? 'bg-[#c9a84c] text-[#0f0f0f] font-semibold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={15} className="shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <div className="px-3 py-2">
          <p className="text-white text-sm font-medium truncate">{user?.nombre} {user?.apellido}</p>
          <p className="text-white/30 text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
