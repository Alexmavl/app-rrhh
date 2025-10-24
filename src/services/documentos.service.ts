import api from "../api/client";

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

export const documentosService = {
  async listarPorEmpleado(idEmpleado: number) {
    const res = await api.get(`/documentos?idEmpleado=${idEmpleado}`);
    return res.data.data;
  },

  async subir(formData: FormData) {
    const res = await api.post("/documentos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async toggle(id: number, payload: { usuarioEjecutorId: number; rolEjecutor: string }) {
    const res = await api.patch(`/documentos/toggle/${id}`, payload);
    return res.data;
  },
};
