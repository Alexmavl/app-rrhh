
export interface TipoDocumento {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  obligatorio?: boolean;
  activo: boolean;
}
