import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/public/PublicLayout';
import AdminLayout from '../layouts/admin/AdminLayout';
import { ProtectedRoute, GuestRoute } from './guards';

// Public
import HomePage from '../modules/vehicles/HomePage';
import CatalogoPage from '../modules/vehicles/CatalogoPage';
import VehiculoDetallePage from '../modules/vehicles/VehiculoDetallePage';

// Auth
import LoginPage from '../modules/auth/LoginPage';
import RegistroPage from '../modules/auth/RegistroPage';
import MiCuentaPage from '../modules/auth/MiCuentaPage';

// Client
import FavoritosPage from '../modules/favorites/FavoritosPage';

// Admin
import DashboardPage from '../modules/dashboard/DashboardPage';
import AdminVehiculosPage from '../modules/vehicles/AdminVehiculosPage';
import AdminMarcasPage from '../modules/brands/AdminMarcasPage';
import AdminModelosPage from '../modules/models/AdminModelosPage';
import AdminImagenesPage from '../modules/images/AdminImagenesPage';
import AdminTransaccionesPage from '../modules/transactions/AdminTransaccionesPage';
import AdminUsuariosPage from '../modules/users/AdminUsuariosPage';
import ReportesPage from '../modules/reports/ReportesPage';
import AuditoriaAdminPage from '../modules/audit/AuditoriaAdminPage';
import { ROLES } from '../types/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'vehiculos', element: <CatalogoPage /> },
      { path: 'vehiculos/:id', element: <VehiculoDetallePage /> },
      {
        path: 'login',
        element: <GuestRoute><LoginPage /></GuestRoute>,
      },
      {
        path: 'registro',
        element: <GuestRoute><RegistroPage /></GuestRoute>,
      },
      {
        path: 'mi-cuenta',
        element: <ProtectedRoute><MiCuentaPage /></ProtectedRoute>,
      },
      {
        path: 'favoritos',
        element: <ProtectedRoute allowedRoles={[ROLES.CLIENTE]}><FavoritosPage /></ProtectedRoute>,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.VENDEDOR, ROLES.ADMINISTRADOR]} redirectTo="/login">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'vehiculos', element: <AdminVehiculosPage /> },
      { path: 'marcas', element: <AdminMarcasPage /> },
      { path: 'modelos', element: <AdminModelosPage /> },
      { path: 'imagenes', element: <AdminImagenesPage /> },
      { path: 'transacciones', element: <AdminTransaccionesPage /> },
      { path: 'reportes', element: <ReportesPage /> },
      {
        path: 'usuarios',
        element: <ProtectedRoute allowedRoles={[ROLES.ADMINISTRADOR]}><AdminUsuariosPage /></ProtectedRoute>,
      },
      {
        path: 'auditoria',
        element: <ProtectedRoute allowedRoles={[ROLES.ADMINISTRADOR]}><AuditoriaAdminPage /></ProtectedRoute>,
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
