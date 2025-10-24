import { Navbar } from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  //  En login no se muestra la barra superior ni el footer
  if (isLoginPage) {
    return (
      <div className="min-h-screen w-full bg-surface-light text-gray-900 transition-colors duration-300">
        <Outlet />
      </div>
    );
  }

  //  Layout principal con Navbar fijo arriba y Footer fijo abajo
  return (
    <div className="flex flex-col h-screen bg-surface-light text-gray-900 transition-colors duration-300 overflow-hidden">
      {/*  Navbar fijo en la parte superior */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/*  Contenido principal con scroll y padding ajustado */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-[68px] pb-24 md:pb-28">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/*  Footer fijo en la parte inferior */}
      <footer 
        className="fixed bottom-0 left-0 right-0 text-white text-center py-3 md:py-4 shadow-inner z-40"
        style={{ backgroundColor: "#023778" }}
      >
        <div className="px-4">
          <p className="text-xs sm:text-sm">
            © {new Date().getFullYear()}{" "}
            <strong className="font-semibold">Sistema RRHH</strong> · Todos los derechos reservados.   Desarrollado por el equipo Grupo No. 1
          </p>
       
        </div>
      </footer>
    </div>
  );
};