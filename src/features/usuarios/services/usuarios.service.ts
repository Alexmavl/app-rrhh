import { api } from "../../../api/client";
import type { Usuario, Rol } from "../models/usuario.model";

// 🔹 Listar usuarios
export async function getUsuarios(): Promise<Usuario[]> {
  const res = await api.get("/usuarios");
  return res.data.data;
}

// 🔹 Crear usuario
export async function createUsuario(data: {
  idRol: number;
  nombre: string;
  email: string;
  password?: string; // ✅ permite undefined
})
{
  const res = await api.post("/usuarios", data);
  return res.data.data;
}

// 🔹 Editar usuario
export async function updateUsuario(id: number, data: {
  idRol: number;
  nombre: string;
  email: string;
}) {
  const res = await api.put(`/usuarios/${id}`, data);
  return res.data.data;
}

// 🔹 Activar / Desactivar usuario
export async function toggleUsuarioActivo(id: number) {
  const res = await api.patch(`/usuarios/${id}/toggle`);
  return res.data.data;
}

// 🔹 Listar roles (para el <select>)
export async function getRoles(): Promise<Rol[]> {
  const res = await api.get("/roles");
  return res.data.data;
}
