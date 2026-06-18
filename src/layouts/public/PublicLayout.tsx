import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="bg-[#0f0f0f] text-white/40 text-xs text-center py-6 mt-20">
        © {new Date().getFullYear()} AutoElite — Todos los derechos reservados
      </footer>
    </div>
  );
}
