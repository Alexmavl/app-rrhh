import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import EmpleadosPage from "../features/empleados/pages/EmpleadosPage";
import DepartamentosPage from "../features/departamentos/pages/DepartamentosPage";
import PuestosPage from "../features/puestos/pages/PuestosPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";
import NominaPage from "../features/nomina/pages/NominaPage";
import LoginPage from "../features/auth/pages/LoginPage";
import InicioPage from "../features/inicio/pages/InicioPage"; // 👈 Nuevo import
import PrivateRoute from "./PrivateRoute";
import { MainLayout } from "../components/layout/MainLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 🟢 Página de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 Rutas protegidas */}
        <Route
          element={
            <PrivateRoute>
              <Outlet />
            </PrivateRoute>
          }
        >
          {/* 👇 Redirección por defecto al Inicio */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          {/* 📊 Página de inicio / dashboard */}
          <Route path="/inicio" element={<InicioPage />} />

          {/* 👥 Módulos principales */}
          <Route path="/empleados" element={<EmpleadosPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/puestos" element={<PuestosPage />} />
          <Route path="/nomina" element={<NominaPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
        </Route>
      </Route>

      {/* ❌ Página 404 */}
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
