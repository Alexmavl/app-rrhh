import api from "../api/client";
import type { Documento } from "../models/documento.model";

export const documentosService = {
  /**
   * 📋 Listar documentos de un empleado
   */
  async listarPorEmpleado(idEmpleado: number): Promise<Documento[]> {
    const res = await api.get(`/documentos?idEmpleado=${idEmpleado}`);
    // ✅ Asegura siempre retornar un array
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  /**
   * 📤 Subir documento (usa FormData con campo 'file')
   */
  async subir(formData: FormData) {
    const res = await api.post("/documentos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * 🔁 Activar / Inactivar documento
   */
  async toggle(id: number, payload: { usuarioEjecutorId: number; rolEjecutor: string }) {
    const res = await api.patch(`/documentos/toggle/${id}`, payload);
    return res.data;
  },

  /**
   * 👁️ Ver documento (abre PDF o imagen directamente)
   */
async ver(id: number) {
  const res = await api.get(`/documentos/ver/${id}`, {
    responseType: "blob", // 📦 recibimos el binario
  });

  const file = new Blob([res.data], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL, "_blank");
},


async validarExpediente(idEmpleado: number, usuarioEjecutorId: number, rolEjecutor: string) {
  const res = await api.post(`/documentos/validar/${idEmpleado}`, {
    usuarioEjecutorId,
    rolEjecutor,
  });
 return Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
},

  /**
   * 📊 Validar expediente detallado (documentos faltantes/subidos)
   */
  async validarExpedienteDetallado(idEmpleado: number) {
    const res = await api.get(`/documentos/validar-detallado/${idEmpleado}`);
    // ✅ Garantiza que sea un array para mapearlo en el frontend
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },
};
