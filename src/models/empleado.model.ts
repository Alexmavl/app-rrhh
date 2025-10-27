export interface Empleado {
  id: number;
  idDepartamento: number;
  idPuesto: number;
  nombres: string;
  apellidos: string;
  dpi: string;
  genero: "M" | "F" ;
  estadoCivil: "Soltero" | "Casado" | "Divorciado" | "Viudo" | "Unión libre";
  email: string;
  telefono?: string;
  direccion?: string;
  estadoLaboral: string;
  fechaIngreso: string;
  activo: boolean;

  // Relaciones opcionales (cuando se listan o consultan)
  nombreDepartamento?: string;
  nombrePuesto?: string;
  salarioBase?: number;
}
