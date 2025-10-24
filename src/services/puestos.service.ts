// src/services/puestos.service.ts
import api from "../api/client";

export interface Puesto {
  id: number;
  nombre: string;
  descripcion: string;
  salarioBase: number;
  activo: boolean;
}

export const puestosService = {
  /** Listar todos los puestos */
  async listar(): Promise<Puesto[]> {
    const res = await api.get("/puestos");

    // Si no hay contenido
    if (res.status === 204) return [];

    // ✅ Manejo flexible del formato de respuesta
    if (res.data && typeof res.data === "object" && Array.isArray(res.data.data)) {
      return res.data.data;
    }

    if (Array.isArray(res.data)) {
      return res.data;
    }

    console.warn("Formato inesperado en listar puestos:", res.data);
    return [];
  },

  /** Crear nuevo puesto */
  async crear(payload: Omit<Puesto, "id" | "activo">) {
    const res = await api.post("/puestos", payload);
    return res.data?.data ?? res.data;
  },

  /** Editar un puesto existente */
  async editar(id: number, payload: Partial<Puesto>) {
    const res = await api.put(`/puestos/${id}`, payload);
    return res.data?.data ?? res.data;
  },

  /** Activar / Inactivar un puesto con manejo de errores del backend */
  async toggleActivo(id: number) {
    try {
      const res = await api.patch(`/puestos/${id}/toggle`);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        "Error al cambiar el estado del puesto.";

      throw {
        response: {
          status,
          data: { message },
        },
      };
    }
  },
};
