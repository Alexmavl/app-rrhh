// src/services/empleados.service.ts
import api from "../api/client";
import type { Empleado } from "../models/empleado.model";

const baseUrl = "/empleados";

export const empleadosService = {
  /** Listar todos los empleados */
  async listar(): Promise<Empleado[]> {
    const res = await api.get(baseUrl);

    // Si el backend devuelve { data: [...] } o directamente un array
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;

    console.warn("Formato inesperado en listar empleados:", res.data);
    return [];
  },

  /** Obtener un empleado por ID */
  async obtenerPorId(id: number): Promise<Empleado> {
    const res = await api.get(`${baseUrl}/${id}`);
    return res.data?.data?.[0] ?? res.data?.data ?? res.data;
  },

  /** Crear nuevo empleado */
  async crear(data: {
    nombres: string;
    apellidos: string;
    dpi: string;
    genero: "M" | "F";
    estadoCivil: string;
    email: string;
    telefono?: string;
    direccion?: string;
    idDepartamento: number;
    idPuesto: number;
    estadoLaboral?: string;
  }) {
    const payload = {
      ...data,
      estadoLaboral: data.estadoLaboral ?? "Activo",
    };

    const res = await api.post(baseUrl, payload);
    return res.data?.data ?? res.data;
  },

  /** Editar un empleado existente */
  async editar(
    id: number,
    data: Partial<{
      nombres: string;
      apellidos: string;
      dpi: string;
      genero: "M" | "F";
      estadoCivil: string;
      email: string;
      telefono?: string;
      direccion?: string;
      idDepartamento: number;
      idPuesto: number;
      estadoLaboral?: string;
    }>
  ) {
    const res = await api.put(`${baseUrl}/${id}`, data);
    return res.data?.data ?? res.data;
  },

  /** Activar o desactivar empleado */
  async toggleActivo(id: number) {
    const res = await api.patch(`${baseUrl}/${id}/toggle`);
    return res.data?.data ?? res.data;
  },
};
