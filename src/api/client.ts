import axios from "axios";
import { API_URL } from "./config";

//  Instancia principal del cliente HTTP
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Interceptor para adjuntar token si existe
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      // Asegura que config.headers exista antes de usarlo
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Sesión expirada. Redirigiendo al login...");
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 👇 Agrega esta línea al final
export default api;
