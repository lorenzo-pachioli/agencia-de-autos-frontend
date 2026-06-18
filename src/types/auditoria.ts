export interface Auditoria {
  id: number; transaccionId: number; vendedorId?: number;
  estadoAnterior?: string; estadoNuevo?: string;
  precioAnterior?: number; precioNuevo?: number;
  fechaCambio?: string; observaciones?: string;
}

export interface AuditoriaFiltros {
  transaccionId?: number; vendedorId?: number;
  fechaDesde?: string; fechaHasta?: string;
  estadoAnterior?: string; estadoNuevo?: string;
  page?: number; size?: number; sort?: string;
}

export interface AuditoriaResponseDTO {
  id: number;
  transaccion_id: number;
  vendedor_id: number;
  created_at: string;

  precioFinalAnterior?: number;
  precioFinalNuevo?: number;

  metodoPagoAnterior?: string;
  metodoPagoNuevo?: string;

  estadoAnterior?: string;
  estadoNuevo?: string;
}

export interface AuditoriaFiltros {
  transaccionId?: number;
  vendedorId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
}