export interface Nomina {
  id: number;
  idEmpleado: number;
  periodo: string;
  tipoPeriodo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  fechaProcesada?: string;
  empleado?: string;         // ✅ agregado
  departamento?: string;     // ✅ agregado
  puesto?: string;           // ✅ agregado
  salarioBase: number;
  totalBonificaciones?: number;
  totalDescuentos?: number;
  totalLiquido?: number;     // ✅ coincide con backend
  estado?: string;
  activo: boolean;
}
