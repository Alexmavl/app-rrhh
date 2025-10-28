// src/services/reportes.service.ts
import api from "../api/client";
import type { ReporteNomina, ReporteDocumentos } from "../models/reporte.model";

export const reportesService = {
  async obtenerNominas(): Promise<ReporteNomina[]> {
    const res = await api.get("/reportes/nominas");
    return Array.isArray(res.data.data) ? res.data.data : [];
  },

  async obtenerDocumentos(): Promise<ReporteDocumentos[]> {
    const res = await api.get("/reportes/documentos");
    return Array.isArray(res.data.data) ? res.data.data : [];
  },
};
