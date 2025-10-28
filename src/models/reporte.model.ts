// src/models/reporte.model.ts

export interface ReporteNomina {
  idEmpleado?: number;
  empleado: string;
  departamento: string;
  puesto?: string;
  periodo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  salarioBase: number;
  bonificacion?: number;
  igss?: number;
  irtra?: number;
  totalDescuentos?: number;
  totalBonificaciones?: number;
  sueldoLiquido: number;
  fechaPago?: string;
  estadoEmpleado?: string;
}

export interface ReporteDocumentos {
  idEmpleado?: number;
  empleado: string;
  departamento?: string;
  documentosRequeridos?: number;
  documentosSubidos?: number;
  documentosAceptados?: number;
  totalDocumentos?: number;
}
