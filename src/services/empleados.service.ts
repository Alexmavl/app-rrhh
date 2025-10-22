import apiClient from "../api/client";
import type { Empleado } from "../models/empleado.model";

export const EmpleadosService = {
  async listar(): Promise<Empleado[]> {
    const { data } = await apiClient.get<Empleado[]>("/empleados");
    return data;
  },

  async obtener(id: number): Promise<Empleado> {
    const { data } = await apiClient.get<Empleado>(`/empleados/${id}`);
    return data;
  },
};
