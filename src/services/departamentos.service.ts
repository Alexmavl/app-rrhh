// src/services/departamentos.service.ts
import api from "../api/client";

export interface Departamento {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export const departamentosService = {
  async listar(): Promise<Departamento[]> {
    const res = await api.get("/departamentos");

    // Maneja diferentes formatos de respuesta (array o { data: [...] })
    if (res.status === 204) return [];

    // Si la respuesta es un objeto con "data", usamos ese arreglo
    if (res.data && typeof res.data === "object" && Array.isArray(res.data.data)) {
      return res.data.data;
    }

    // Si el backend ya devuelve un array directamente
    if (Array.isArray(res.data)) {
      return res.data;
    }

    // En caso de error o formato desconocido
    console.warn("Formato inesperado en listar departamentos:", res.data);
    return [];
  },

  async crear(payload: Omit<Departamento, "id" | "activo">) {
    const res = await api.post("/departamentos", payload);
    return res.data?.data ?? res.data;
  },

  async editar(id: number, payload: Partial<Departamento>) {
    const res = await api.put(`/departamentos/${id}`, payload);
    return res.data?.data ?? res.data;
  },

  async toggleActivo(id: number) {
    const res = await api.patch(`/departamentos/${id}/toggle`);
    return res.data?.data ?? res.data;
  },
};
