import { ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface Props {
  children: ReactNode;
  rolesPermitidos?: string[]; //  nuevo parámetro opcional para control de rol
}

export default function PrivateRoute({ children, rolesPermitidos }: Props) {
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

  // Obtener usuario autenticado desde el contexto
  const { user } = auth || {};
  const token = sessionStorage.getItem("token");

  //  Si no hay token o usuario, redirigir al login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se definen roles permitidos y el usuario no tiene uno de ellos
  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
  return <Navigate to="/403" replace />;

  }

  // Si todo está bien, renderiza el contenido protegido
  return <>{children}</>;
}
