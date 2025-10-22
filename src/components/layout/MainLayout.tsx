// src/components/layout/MainLayout.tsx
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // 🚫 Oculta Navbar y Sidebar en /login
  if (isLoginPage) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
        <Outlet />
      </main>
    );
  }

  // ✅ Layout completo para las demás rutas
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
