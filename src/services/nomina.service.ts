import { api } from "../api/client";
import type { Nomina } from "../models/nomina.model";

export const nominaService = {
  /** 🔹 Listar todas las nóminas */
  async listar(): Promise<Nomina[]> {
    const res = await api.get("/nominas");

    // ✅ Tu API devuelve { success, message, data: [...] }
    if (Array.isArray(res.data)) return res.data; // por si acaso
    if (Array.isArray(res.data.data)) return res.data.data;

    console.warn("⚠️ Respuesta inesperada en /nominas:", res.data);
    return [];
  },

  /** 🔹 Obtener una nómina específica por ID */
  async obtenerPorId(id: number): Promise<Nomina> {
    const res = await api.get(`/nominas/${id}`);
    const data = res.data;

    // Si devuelve { success, data: [...] }
    if (Array.isArray(data.data)) return data.data[0];
    if (Array.isArray(data)) return data[0];

    return data.data || data;
  },

  /** 🔹 Crear una nueva nómina */
  async crear(data: Partial<Nomina>) {
    const res = await api.post("/nominas", data);
    return res.data.data ?? res.data; // compatible con backend
  },


  
};


