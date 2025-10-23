import { Navbar } from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // 🟢 En login no se muestra la barra superior ni el footer
  if (isLoginPage) {
    return (
      <div className="min-h-screen w-full bg-surface-light text-gray-900 transition-colors duration-300">
        <Outlet />
      </div>
    );
  }

  // ✅ Layout principal con Navbar arriba y Footer abajo
  return (
    <div className="flex flex-col min-h-screen bg-surface-light text-gray-900 transition-colors duration-300">
      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🔹 Contenido principal */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* 🔹 Footer */}
      <footer className="bg-blue-600 text-white text-center py-4 mt-8 shadow-inner">
        <p className="text-sm">
          © {new Date().getFullYear()} <strong>Sistema RRHH</strong> · Todos los derechos reservados.
           Desarrollado por el equipo Grupo No. 1
        </p>
       
      </footer>
    </div>
  );
};
