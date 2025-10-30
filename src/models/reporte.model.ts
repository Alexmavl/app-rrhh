/**
 * ==============================
 *  📘 MODELOS DE REPORTES RH
 * ==============================
 */

/**
 * 🧾 Reporte de Nómina
 *  Basado en: sp_reporte_general
 */
export interface ReporteNomina {
  /** Identificador del empleado */
  idEmpleado: number;
  /** Nombre completo del empleado */
  empleado: string;
  /** Departamento al que pertenece */
  departamento: string;
  /** Puesto laboral */
  puesto?: string;
  /** Periodo procesado */
  periodo: string;
  /** Tipo de periodo (Mensual, Quincenal, etc.) */
  tipoPeriodo?: string;
  /** Fecha de inicio del periodo */
  fechaInicio?: string;
  /** Fecha de fin del periodo */
  fechaFin?: string;
  /** Salario base del empleado */
  salarioBase: number;
  /** Total de bonificaciones sumadas */
  totalBonificaciones?: number;
  /** Total de descuentos aplicados */
  totalDescuentos?: number;
  /** Sueldo líquido final */
  sueldoLiquido: number;
  /** Fecha de procesamiento */
  fechaProcesada?: string;
  /** Estado de la nómina */
  estado?: string;
  /** Estado laboral del empleado (Activo/Inactivo) */
  estadoEmpleado?: string;
  /** Valor lógico del estado activo (1 o 0) */
  activo?: number;
}

/**
 * 📂 Reporte de Documentos
 *  Basado en: sp_reporte_documentos
 */
export interface ReporteDocumentos {
  /** Identificador del empleado */
  idEmpleado: number;
  /** Nombre completo del empleado */
  empleado: string;
  /** Departamento al que pertenece */
  departamento: string;
  /** Número total de documentos requeridos */
  documentosRequeridos: number;
  /** Documentos subidos por el empleado */
  documentosSubidos: number;
  /** Documentos aprobados */
  documentosAceptados: number;
  /** Lista de nombres de documentos requeridos */
  nombresRequeridos?: string;
  /** Lista de documentos subidos con estado */
  nombresSubidos?: string;
  /** Lista de documentos faltantes */
  nombresFaltantes?: string;
}
