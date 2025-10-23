// src/routes/PrivateRoute.tsx
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

  // ⏳ Mientras el contexto verifica sesión, mostrar spinner
  if (auth?.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // 🚫 Si no hay usuario ni token → redirige al login
  const token = sessionStorage.getItem("token");
  const usuario = sessionStorage.getItem("usuario");

  if (!auth?.user && (!token || !usuario)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Si todo está bien → renderiza las rutas protegidas
  return <>{children}</>;
}
