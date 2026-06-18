import { NavLink } from 'react-router-dom';
import {
  Car, Users, Tag, Layers, Image, Heart,
  ReceiptText, ClipboardList, Settings, ShieldCheck,
  Search, BarChart2, Zap, ChevronRight,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  children?: { to: string; label: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { to: '/config', label: 'Configuración', icon: Settings },
  { to: '/auth', label: 'Auth', icon: ShieldCheck },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/marcas', label: 'Marcas', icon: Tag },
  { to: '/modelos', label: 'Modelos', icon: Layers },
  {
    to: '/vehiculos', label: 'Vehículos', icon: Car,
    children: [
      { to: '/vehiculos/busqueda', label: 'Búsqueda', icon: Search },
      { to: '/vehiculos/reportes', label: 'Reportes', icon: BarChart2 },
    ],
  },
  { to: '/imagenes', label: 'Imágenes', icon: Image },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  {
    to: '/transacciones', label: 'Transacciones', icon: ReceiptText,
    children: [
      { to: '/transacciones/acciones', label: 'Acciones', icon: Zap },
    ],
  },
  { to: '/auditoria', label: 'Auditoría', icon: ClipboardList },
];

function NavItemLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <div>
      <NavLink
        to={item.to}
        end={!item.children}
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
            isActive
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`
        }
      >
        <Icon size={15} className="shrink-0" />
        <span>{item.label}</span>
        {item.children && <ChevronRight size={12} className="ml-auto opacity-50" />}
      </NavLink>
      {item.children && (
        <div className="ml-4 mt-0.5 space-y-0.5 pl-3 border-l border-slate-700">
          {item.children.map(child => {
            const ChildIcon = child.icon;
            return (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all duration-150 ${
                    isActive
                      ? 'text-blue-400 font-medium'
                      : 'text-slate-500 hover:text-slate-300'
                  }`
                }
              >
                <ChildIcon size={12} />
                {child.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-slate-900 flex flex-col py-5 px-3 gap-0.5 shrink-0 border-r border-slate-800">
      <div className="px-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car size={14} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">Agencia</p>
            <p className="text-slate-500 text-xs">API Tester</p>
          </div>
        </div>
      </div>

      <div className="px-3 mb-2">
        <p className="text-xs uppercase text-slate-600 font-semibold tracking-widest">Módulos</p>
      </div>

      {navItems.map(item => (
        <NavItemLink key={item.to} item={item} />
      ))}
    </aside>
  );
}
