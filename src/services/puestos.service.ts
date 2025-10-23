import api from "../api/client";

export interface Puesto {
  id: number;
  nombre: string;
  descripcion: string;
  salarioBase: number;
  activo: boolean;
}

export const puestosService = {
  /** 🔹 Listar todos los puestos */
  async listar(): Promise<Puesto[]> {
    const res = await api.get<Puesto[]>("/puestos");
    if (res.status === 204) return [];
    return res.data;
  },

  /** 💾 Crear nuevo puesto */
  async crear(payload: Omit<Puesto, "id" | "activo">) {
    const res = await api.post("/puestos", payload);
    return res.data;
  },

  /** ✏️ Editar un puesto existente */
  async editar(id: number, payload: Partial<Puesto>) {
    const res = await api.put(`/puestos/${id}`, payload);
    return res.data;
  },

  /** 🔁 Activar/Inactivar un puesto con manejo de errores del backend */
  async toggleActivo(id: number) {
    try {
      const res = await api.patch(`/puestos/${id}/toggle`);
      return res.data;
    } catch (error: any) {
      // 🧩 AxiosError: si el backend devuelve status 409 o mensaje de negocio
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        "Error al cambiar el estado del puesto.";

      // 🔥 Re-lanzar error con la estructura esperada por React Query
      throw {
        response: {
          status,
          data: { message },
        },
      };
    }
  },
};
