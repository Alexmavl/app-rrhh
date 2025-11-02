export interface Usuario {
  id: number;
  idRol: number;
  nombre: string;
  email: string;
  activo: boolean;
  fechaCreacion: string;
  rolNombre?: string;
  idEmpleado?: number | null;
  empleadoNombre?: string | null;
}

export interface Rol {
  id: number;
  nombre: string;
}
