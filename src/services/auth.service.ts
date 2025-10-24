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
  try {
    const res = await api.post(`${API_URL}/auth/login`, data);

    // Verificar estructura esperada del backend
    const user = res.data?.data;
    if (!user || !user.token) {
      throw new Error("Respuesta del servidor inválida o token faltante.");
    }

    // Guardar sesión
    sessionStorage.setItem("token", user.token);
    sessionStorage.setItem("usuario", JSON.stringify(user));

    return user as LoginResponse;
  } catch (error: any) {
    // Manejo de errores controlado
    if (error.response?.status === 401) {
      throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
    }
    throw new Error(error.message || "Error al iniciar sesión.");
  }
}

/**
 * Cierra sesión y limpia la sesión local
 */
export async function logout(): Promise<void> {
  sessionStorage.clear();
  try {
    await api.post(`${API_URL}/auth/logout`);
  } catch {
    // Si el backend no tiene logout, no hay problema
  }
}
