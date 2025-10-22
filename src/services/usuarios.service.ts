// src/services/usuarios.service.ts
import { api } from "../api/client";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}
 export async function getPerfil() {
  const res = await api.get("/auth/perfil");
  return res.data;
}