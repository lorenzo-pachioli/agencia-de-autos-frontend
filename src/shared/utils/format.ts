import type { EstadoTransaccion } from "../../types/transaccion";

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export const formatNumber = (n: number) =>
  new Intl.NumberFormat('es-AR').format(n);

export const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

export const estadoLabel: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADO: 'Reservado',
  VENDIDO: 'Vendido',
  EN_REPARACION: 'En preparación',
  BAJA: 'Baja',
};

export const estadoBadge: Record<string, string> = {
  DISPONIBLE: 'badge-disponible',
  RESERVADO: 'badge-reservado',
  VENDIDO: 'badge-vendido',
  EN_REPARACION: 'badge-en_reparacion',
  BAJA: 'badge-baja',
};

export const combustibleLabel: Record<string, string> = {
  NAFTA: 'Nafta',
  DIESEL: 'Diésel',
  ELECTRICO: 'Eléctrico',
  HIBRIDO: 'Híbrido',
  GNC: 'GNC',
};

export const transmisionLabel: Record<string, string> = {
  MANUAL: 'Manual',
  AUTOMATICA: 'Automática',
};

export const transaccionEstadoLabel: Record<EstadoTransaccion, string> = {
  RESERVA: 'Reserva',
  SENIADO: 'Señada',
  VENDIDO: 'Vendida',
  CANCELADO: 'Cancelada',
};

export const transaccionEstadoBadge: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  SENIADA: 'bg-blue-100 text-blue-800',
  VENDIDA: 'bg-emerald-100 text-emerald-800',
  CANCELADA: 'bg-red-100 text-red-700',
};

// Retorna la fecha de hoy en formato YYYY-MM-DD
export const obtenerFechaHoy = () => new Date().toISOString().split('T')[0];

// Retorna la fecha de hace 30 días en formato YYYY-MM-DD
export const obtenerFechaHace30Dias = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
};