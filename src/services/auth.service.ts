import { API_URL } from "../api/config";
import { api } from "../api/client";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token: string;
}

/**
 * Inicia sesión en el backend
 */
export async function login(data: LoginInput): Promise<LoginResponse> {
  const res = await api.post(`${API_URL}/auth/login`, data);
  return res.data as LoginResponse;
}

/**
 * Cierra sesión (opcional, según backend)
 */
export async function logout(): Promise<void> {
  await api.post(`${API_URL}/auth/logout`);
}
