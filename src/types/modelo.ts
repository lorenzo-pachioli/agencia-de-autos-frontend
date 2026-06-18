export interface Modelo {
  id: number; nombre: string; anio: number;
  tipoModelo: TipoModelo; activo: boolean; marca: string; marcaNombre?: string;
}
export interface ModeloForm {
  nombre: string; anio: number; tipoModelo: TipoModelo; activo: boolean; marcaId: number;
}

export const tipoModelo = {
  AUTO: "AUTO",
  MOTO: "MOTO",
  CAMIONETA: "CAMIONETA",
  SUV: "SUV",
  UTILITARIO: "UTILITARIO"
};
export type TipoModelo = typeof tipoModelo[keyof typeof tipoModelo];
