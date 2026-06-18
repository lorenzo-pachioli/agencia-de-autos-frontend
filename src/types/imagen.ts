export interface Imagen {
  id: number; url: string;
  esPrincipal?: boolean; patenteVehiculo: string;
}
export interface CreateImagenRequest {
  id?: number; url: string; esPrincipal?: boolean; vehiculoId: number;
}
