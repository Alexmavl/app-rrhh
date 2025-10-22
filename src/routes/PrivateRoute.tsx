// src/routes/PrivateRoute.tsx
import { ReactNode, useContext,} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // 🔒 Verifica si hay sesión activa
  const token = sessionStorage.getItem("token");
  const usuario = sessionStorage.getItem("usuario");

  // Si no hay usuario ni token, redirige al login
  if ((!auth || !auth.user) && (!token || !usuario)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si todo está bien, renderiza el contenido protegido
  return <>{children}</>;
}
