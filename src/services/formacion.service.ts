import api from "../api/client";

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
  /** 🔹 Listar formaciones académicas */
async listar(idEmpleado?: number): Promise<Formacion[]> {
  // Si se pasa idEmpleado, agrega el filtro en la URL
  const url = idEmpleado ? `/formacion?idEmpleado=${idEmpleado}` : "/formacion";
  const res = await api.get(url);

  // Manejar diferentes estructuras de respuesta
  if (res.status === 204) return [];

  if (res.data && typeof res.data === "object" && Array.isArray(res.data.data)) {
    return res.data.data;
  }

  if (Array.isArray(res.data)) {
    return res.data;
  }

  console.warn("Formato inesperado en listar formacion:", res.data);
  return [];
},

  /** 🔹 Crear nueva formación */
  async crear(payload: {
    idEmpleado: number;
    nivel: string;
    institucion: string;
    titulo: string;
    anioFinalizacion: number;
    usuarioEjecutorId: number;
    rolEjecutor: string;
    descripcion?: string;
  }) {
    const res = await api.post("/formacion", payload);
    return res.data?.data ?? res.data;
  },

  /** 🔹 Editar formación existente */
  async editar(
    id: number,
    payload: Partial<Formacion> & { usuarioEjecutorId: number; rolEjecutor: string }
  ) {
    const res = await api.put(`/formacion/${id}`, payload);
    return res.data?.data ?? res.data;
  },

  /** 🔹 Activar / Inactivar formación */
  async toggleActivo(
    id: number,
    payload: { usuarioEjecutorId: number; rolEjecutor: string }
  ) {
    const res = await api.patch(`/formacion/toggle/${id}`, payload);
    return res.data?.data ?? res.data;
  },
};
