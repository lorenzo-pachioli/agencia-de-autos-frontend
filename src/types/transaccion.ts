export type EstadoTransaccion = 'RESERVA' | 'SENIADO' | 'VENDIDO' | 'CANCELADO';

export const ESTADOS: EstadoTransaccion[] = ['RESERVA', 'SENIADO', 'VENDIDO', 'CANCELADO'];

export interface Transaccion {
  id: number;
  patente: string;
  vehiculo_id: number;
  cliente_id: number;
  cliente_email: string;
  vendedor_id: number;
  vendedor_email: string;
  estadoTransaccion: EstadoTransaccion;
  metodoPago?: string;
  precio_final?: number;
  montoSenia?: number;
  observaciones?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface TransaccionFiltros {
  vehiculo_id?: number; cliente_id?: number; vendedor_id?: number;
  fechaDesde: string; fechaHasta: string;
  estadoTransaccion?: string; page?: number;
}

export interface TransaccionCrearDTO {
  vehiculo_id: number;
  cliente_id: number;
  vendedor_id: number;
  metodoPago: METODO_PAGO;
  estadoTransaccion: EstadoTransaccion;
  observaciones: string;
  precio_final: number;
}

export type METODO_PAGO = 'EFECTIVO' | 'TRANSFERENCIA' | 'PLAN_AHORRO' | 'CUOTA_BANCARIZADA';

export const MetodoPago: METODO_PAGO[] = ['EFECTIVO', 'TRANSFERENCIA', 'PLAN_AHORRO', 'CUOTA_BANCARIZADA']

export interface TransaccionBalanceResponseDTO {
  precios_final_total: number;
  comisiones_total: number;
  costos_vehiculos_vendidos: number;
  ingreso_final: number;
  fecha_desde: string;
  fecha_hasta: string;
}

export interface TransaccionComisionResponseDTO {
  id: number;
  comision_total: number;
  vendedor_id: number;
  nombre_completo: string;
  email: string;
}