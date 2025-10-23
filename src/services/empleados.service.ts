import api from "../api/client";
import type { Empleado } from "../models/empleado.model";

export const empleadosService = {
  async listar(): Promise<Empleado[]> {
    const res = await api.get<Empleado[]>("/empleados"); // ✅ Tipamos el tipo de respuesta
    if (res.status === 204) return [];
    return res.data;
  },

  async obtenerPorId(id: number): Promise<Empleado> {
    const res = await api.get<Empleado>(`/empleados/${id}`); // ✅
    return res.data;
  },

  async crear(
    payload: Omit<Empleado, "id" | "activo" | "fechaIngreso"> & { estadoLaboral?: string }
  ): Promise<Empleado> {
    const res = await api.post<Empleado>("/empleados", payload); // ✅
    return res.data;
  },

  async editar(id: number, payload: Partial<Empleado>): Promise<Empleado> {
    const res = await api.put<Empleado>(`/empleados/${id}`, payload); // ✅
    return res.data;
  },

  async toggleActivo(id: number): Promise<Empleado> {
    const res = await api.patch<Empleado>(`/empleados/${id}/toggle`); // ✅
    return res.data;
  },
};
