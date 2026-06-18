export type EstadoVehiculo = 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO' | 'EN_REPARACION';
export type TipoTransmision = 'MANUAL' | 'AUTOMATICA';
export type TipoCombustible = 'NAFTA' | 'DIESEL' | 'ELECTRICO' | 'HIBRIDO' | 'GNC';

export interface Vehiculo {
  id: number; patente: string; anio: number;
  precioAdquisicion: number; precioVenta: number;
  modeloNombre: string; kilometraje: number; color: string;
  descripcion: string; estado: EstadoVehiculo;
  tipoTransmision: TipoTransmision; tipoCombustible: TipoCombustible;
  imagenPrincipalUrl: string; imagenes: string[];
}

export interface VehiculoFiltros {
  marcaId?: number; modeloId?: number; combustible?: string;
  tipoTransmision?: string; estado?: string; color?: string;
  minPrecio?: number; maxPrecio?: number; page?: number;
}
