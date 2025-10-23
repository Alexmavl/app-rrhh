import api from "../api/client";
import type { Empleado, EmpleadoCreateDto, EmpleadoEditDto } from "../models/empleado.model";

export const empleadosService = {
  async listar(): Promise<Empleado[]> {
    const res = await api.get<Empleado[]>("/empleados");
    if (res.status === 204) return [];
    return res.data;
  },

  async obtenerPorId(id: number): Promise<Empleado> {
    const res = await api.get<Empleado>(`/empleados/${id}`);
    return res.data;
  },

  // ✅ Crear empleado con DTO
  async crear(payload: EmpleadoCreateDto): Promise<Empleado> {
    const res = await api.post<Empleado>("/empleados", payload);
    return res.data;
  },

  // ✅ Editar empleado con DTO
  async editar(id: number, payload: Partial<EmpleadoEditDto>): Promise<Empleado> {
    const res = await api.put<Empleado>(`/empleados/${id}`, payload);
    return res.data;
  },

  async toggleActivo(id: number): Promise<Empleado> {
    const res = await api.patch<Empleado>(`/empleados/${id}/toggle`);
    return res.data;
  },
};
