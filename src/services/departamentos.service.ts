import api from "../api/client";

export interface Departamento {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export const departamentosService = {
  async listar(): Promise<Departamento[]> {
    const res = await api.get<Departamento[]>("/departamentos");
    if (res.status === 204) return [];
    return res.data;
  },

  async crear(payload: Omit<Departamento, "id" | "activo">) {
    const res = await api.post("/departamentos", payload);
    return res.data;
  },

  async editar(id: number, payload: Partial<Departamento>) {
    const res = await api.put(`/departamentos/${id}`, payload);
    return res.data;
  },

  async toggleActivo(id: number) {
    const res = await api.patch(`/departamentos/${id}/toggle`);
    return res.data;
  },
};
