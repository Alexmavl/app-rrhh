// src/services/usuarios.service.ts
import { api } from "../api/client";
import { API_URL } from "../api/config";

// Tipos de datos
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token?: string;
}

/**
 * Iniciar sesión (login)
 * Endpoint esperado: POST /api/auth/login
 */
export async function login(email: string, password: string): Promise<Usuario> {
  const response = await api.post<Usuario>(`${API_URL}/auth/login`, {
    email,
    password,
  });

  const data = response.data;

  // ✅ Guarda token y usuario en sessionStorage
  if (data.token) {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("usuario", JSON.stringify(data));
  }

  return data;
}

/**
 * Obtener perfil actual del usuario autenticado
 * Endpoint esperado: GET /api/auth/perfil
 */
export async function getPerfil(): Promise<Usuario> {
  const res = await api.get<Usuario>(`${API_URL}/auth/perfil`);
  return res.data;
}
