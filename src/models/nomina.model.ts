// src/models/nomina.model.ts
export interface Nomina {
  id: number;
  idEmpleado: number;
  nombreEmpleado?: string;
  salarioBase: number;
  bonificacion?: number;
  descuentos?: number;
  totalPagar: number;
  fechaGeneracion: string;
  periodo: string;
  activo: boolean;
}
