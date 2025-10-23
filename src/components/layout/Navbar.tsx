import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import type { AuthContextType } from "../../context/AuthContext";
import {
  Users,
  Building2,
  BriefcaseBusiness,
  DollarSign,
  BarChart2,
  LogOut,
  LogIn,
} from "lucide-react";

export const Navbar = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { to: "/empleados", label: "Empleados", icon: <Users size={16} /> },
    { to: "/departamentos", label: "Departamentos", icon: <Building2 size={16} /> },
    { to: "/puestos", label: "Puestos", icon: <BriefcaseBusiness size={16} /> },
    { to: "/nomina", label: "Nómina", icon: <DollarSign size={16} /> },
    { to: "/reportes", label: "Reportes", icon: <BarChart2 size={16} /> },
  ];

  return (
    <nav
      className="px-6 py-3 flex flex-wrap justify-between items-center shadow-md
                 bg-blue-600 text-white transition-colors duration-300"
    >
      {/* 🔹 Logo / Home */}
      <h1
        onClick={() => navigate("/")}
        className="font-bold text-lg cursor-pointer hover:opacity-90 select-none flex items-center gap-2"
      >
        <BriefcaseBusiness size={20} />
        Sistema RRHH
      </h1>

      {/* 🧭 Menú principal */}
      <div className="flex flex-wrap gap-4 text-sm font-medium">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1 hover:underline underline-offset-4 transition-colors ${
                isActive ? "text-yellow-300 font-semibold" : "hover:text-gray-200"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* ⚙️ Acciones de usuario */}
      <div className="flex items-center gap-3">
        {auth?.user ? (
          <>
            <span className="text-sm font-medium select-none flex items-center gap-1">
              👤 {auth.user.nombre}{" "}
              <span className="opacity-80">({auth.user.rol})</span>
            </span>
            <button
              onClick={auth.logout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                         bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                       bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            <LogIn size={16} />
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
};
