import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  Users,
  Building2,
  BriefcaseBusiness,
  DollarSign,
  BarChart2,
  LogOut,
  LogIn,
  Briefcase,
  Menu,
  X,
  UserCircle,
  ShieldCheck,
  FileText, // 👈 Icono para Mis Documentos
} from "lucide-react";

export const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!auth) return null;
  const { user, logout } = auth;

  // 🔹 Menú principal dinámico según el rol
 let menuItems: { to: string; label: string; icon: React.ReactNode }[] = [];


  if (user) {
    // 👔 ADMIN y RRHH → menú completo
    if (user.rol === "Admin" || user.rol === "RRHH") {
      menuItems = [
        { to: "/empleados", label: "Empleados", icon: <Users size={20} /> },
        { to: "/departamentos", label: "Departamentos", icon: <Building2 size={20} /> },
        { to: "/puestos", label: "Puestos", icon: <BriefcaseBusiness size={20} /> },
        { to: "/nomina", label: "Nómina", icon: <DollarSign size={20} /> },
        { to: "/reportes", label: "Reportes", icon: <BarChart2 size={20} /> },
      ];

      // ✅ Solo Admin ve “Usuarios”
      if (user.rol === "Admin") {
        menuItems.push({
          to: "/usuarios",
          label: "Usuarios",
          icon: <ShieldCheck size={20} />,
        });
      }
    }

    if (user.rol === "Empleado" || user.rol === "Admin") {
  menuItems.push({
    to: "/documentos",
    label: "Documentos",
    icon: <FileText size={20} />,
  });
}

  }

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className="px-4 md:px-6 py-3 flex justify-between items-center shadow-md
                   text-white transition-colors duration-300 relative z-50"
        style={{ backgroundColor: "#023778" }}
      >
        {/* Logo */}
        <h1
          onClick={() => navigate("/inicio")}
          className="font-bold text-lg md:text-xl cursor-pointer hover:opacity-90 
                     select-none flex items-center gap-2"
        >
          <Briefcase size={24} />
          <span className="hidden sm:inline">Sistema RRHH</span>
          <span className="sm:hidden">RRHH</span>
        </h1>

        {/* 🔹 Menú Desktop */}
        {user && (
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 hover:text-yellow-300 
                             transition-colors duration-200 ${
                    isActive ? "text-yellow-300 font-semibold" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Usuario y Logout Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <UserCircle size={24} className="text-yellow-300" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">
                    {user.nombre}
                  </span>
                  <span className="text-xs opacity-80 leading-tight">
                    {user.rol}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
                           font-medium transition-all bg-red-600 hover:bg-red-700 
                           text-white shadow-sm hover:shadow-md"
              >
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm 
                         font-medium transition-all bg-green-600 hover:bg-green-700 
                         text-white shadow-sm hover:shadow-md"
            >
              <LogIn size={18} />
              Iniciar sesión
            </button>
          )}
        </div>

        {/* Botón hamburguesa */}
        {user && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg 
                       transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}

        {/* Login botón móvil */}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg 
                       text-sm font-medium transition-all bg-green-600 
                       hover:bg-green-700 text-white shadow-sm"
          >
            <LogIn size={18} />
            <span className="hidden sm:inline">Iniciar sesión</span>
          </button>
        )}
      </nav>

      {/* 🔹 Menú móvil con animación */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 sm:w-80 shadow-2xl z-50 
                         lg:hidden overflow-y-auto"
              style={{ backgroundColor: "#023778" }}
            >
              {/* Header menú móvil */}
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-white">
                    <Briefcase size={24} />
                    <span className="font-bold text-lg">Sistema RRHH</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg 
                               transition-colors duration-200"
                    aria-label="Abrir o cerrar menú"
                    title="Abrir o cerrar menú"
                  >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
                </div>

                {/* Info usuario */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 
                                border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-yellow-300 rounded-full p-2">
                      <UserCircle size={28} className="text-[#023778]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-base leading-tight">
                        {user.nombre}
                      </p>
                      <p className="text-yellow-300 text-sm font-medium leading-tight mt-1">
                        {user.rol}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items del menú */}
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg 
                                   transition-all duration-200 ${
                          isActive
                            ? "bg-yellow-400 text-[#023778] font-semibold shadow-lg"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        {item.icon}
                        <span className="text-base">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Botón logout */}
              <div className="p-4 border-t border-white/20 mt-auto">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 
                             rounded-lg text-base font-medium transition-all 
                             bg-red-600 hover:bg-red-700 text-white shadow-lg
                             hover:shadow-xl hover:scale-[1.02]"
                >
                  <LogOut size={20} />
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
