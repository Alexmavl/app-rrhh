import apiClient from "../api/client";

export interface TipoDocumento {
  id: number;
  nombre: string;
  categoria: string;
  requerido: boolean;
  activo: boolean;
}

/**
 * Servicio para interactuar con la API de Tipos de Documento
 */
export const tiposDocumentoService = {
  /**  Listar tipos de documento */
  async listar(): Promise<TipoDocumento[]> {
    const res = await apiClient.get("/tipos-documento");
    return res.data.data || [];
  },
};
