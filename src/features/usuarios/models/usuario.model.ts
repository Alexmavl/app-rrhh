export interface Usuario {
  id: number;
  idRol: number;
  nombre: string;
  email: string;
  activo: boolean;
  fechaCreacion: string;
  rolNombre?: string;
}

export interface Rol {
  id: number;
  nombre: string;
}
