import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import type { AuthContextType } from "../../context/AuthContext";
import { useDarkMode } from "../../hooks/useDarkMode";

export const Navbar = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const { dark, setDark } = useDarkMode();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow dark:bg-gray-900 transition-colors">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-lg">Sistema RRHH</h1>
        <div className="flex gap-4">
          <Link to="/empleados" className="hover:underline">
            Empleados
          </Link>
          <Link to="/nomina" className="hover:underline">
            Nómina
          </Link>
          <Link to="/reportes" className="hover:underline">
            Reportes
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDark(!dark)}
          className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded-md text-sm transition"
        >
          {dark ? "☀️ Claro" : "🌙 Oscuro"}
        </button>

        {auth?.user ? (
          <>
            <span className="text-sm">
              👤 {auth.user.nombre} ({auth.user.rol})
            </span>
            <button
              onClick={auth.logout}
              className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-sm"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-md text-sm"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
};
