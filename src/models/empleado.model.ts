export interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  idDepartamento: number;
  nombreDepartamento?: string;
  idPuesto: number;
  nombrePuesto?: string;
  salarioBase?: number;
  estadoLaboral: string;
  fechaIngreso?: string;
  activo: boolean;
}

// ✅ DTOs (lo que realmente se envía al backend)
export interface EmpleadoCreateDto {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  idDepartamento: number;
  idPuesto: number;
  estadoLaboral?: string;
}

export interface EmpleadoEditDto extends EmpleadoCreateDto {
  id: number;
}
