import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { Usuario } from "./AuthContext";
import { getPerfil } from "../services/usuarios.service";

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cerrar sesión
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  // Mantener sesión activa
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("usuario");

    // Si ya hay usuario guardado en sesión
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLoading(false);
      } catch {
        sessionStorage.clear();
        setLoading(false);
      }
    } else if (token) {
      // Intentar validar token contra backend
      getPerfil()
  .then((perfil) => {
    const perfilData = perfil as Usuario;
    setUser({ ...perfilData, token });
  })

        .catch(() => sessionStorage.clear())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
