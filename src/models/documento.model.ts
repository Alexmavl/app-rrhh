
export interface Documento {
  id: number;
  idEmpleado: number;
  idTipoDocumento: number;
  nombreArchivo: string;
  rutaArchivo: string;
  observaciones?: string;
  fechaSubida: string;
  estado?: string;
  activo: boolean;
  tipoDocumentoNombre?: string;
}
