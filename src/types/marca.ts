export interface Marca { id: number; nombre: string; paisOrigen?: string; activo?: boolean; }
export interface CreateMarcaRequest { nombre: string; paisOrigen?: string; }
