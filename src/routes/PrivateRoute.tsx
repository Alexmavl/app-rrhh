import { ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // Si el contexto aún está verificando sesión → mostrar spinner
  if (auth?.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Obtener token y usuario del sessionStorage
  const token = sessionStorage.getItem("token");
  const usuario = sessionStorage.getItem("usuario");

  // Si no hay token o usuario → redirigir al login
  if (!token || !usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay token, usuario y el contexto está listo → renderizar contenido protegido
  return <>{children}</>;
}
