// src/routes/AppRouter.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import EmpleadosPage from "../features/empleados/pages/EmpleadosPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";
import NominaPage from "../features/nomina/pages/NominaPage";
import LoginPage from "../features/auth/pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import { MainLayout } from "../components/layout/MainLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 🟢 Login (sin Navbar/Sidebar gracias a MainLayout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 Rutas protegidas */}
        <Route
          element={
            <PrivateRoute>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Navigate to="/empleados" />} />
          <Route path="/empleados" element={<EmpleadosPage />} />
          <Route path="/nomina" element={<NominaPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
        </Route>
      </Route>

      {/* ❌ 404 */}
      <Route
        path="*"
        element={
          <h1 className="text-center mt-10 text-2xl font-bold text-red-600">
            404 - Página no encontrada
          </h1>
        }
      />
    </Routes>
  );
}
