export interface Empleado {
  id: number;
  idDepartamento: number;
  idPuesto: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  estadoLaboral: string;
  fechaIngreso: string;
  activo: boolean;
}
