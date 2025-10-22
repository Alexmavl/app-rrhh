// src/services/nomina.service.ts
import { api } from "../api/client";
import type { Nomina } from "../models/nomina.model";

export const nominaService = {
  async listar(): Promise<Nomina[]> {
    const res = await api.get("/nominas");
    return res.data;
  },

  async obtenerPorId(id: number): Promise<Nomina> {
    const res = await api.get(`/nominas/${id}`);
    return res.data;
  },

  async crear(data: Partial<Nomina>) {
    const res = await api.post("/nominas", data);
    return res.data;
  },
};
