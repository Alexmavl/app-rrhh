import { api } from "../api/client";
import { API_URL } from "../api/config";

export interface Formacion {
  id: number;
  idEmpleado: number;
  nivel: string;
  institucion: string;
  titulo: string;
  anioFinalizacion: number;
  activo: boolean;
}

export const formacionService = {
  async listar(): Promise<Formacion[]> {
    const res = await api.get(`${API_URL}/formacion`);
    return res.data.data;
  },

  async crear(data: Partial<Formacion> & { usuarioEjecutorId: number; rolEjecutor: string }) {
    const res = await api.post(`${API_URL}/formacion`, data);
    return res.data;
  },

  async modificar(id: number, data: Partial<Formacion> & { usuarioEjecutorId: number; rolEjecutor: string }) {
    const res = await api.put(`${API_URL}/formacion/${id}`, data);
    return res.data;
  },

  async toggle(id: number, data: { usuarioEjecutorId: number; rolEjecutor: string }) {
    const res = await api.patch(`${API_URL}/formacion/toggle/${id}`, data);
    return res.data;
  },
};
