import { Routes, Route, Navigate } from "react-router-dom";
import EmpleadosPage from "../features/empleados/pages/EmpleadosPage"; // ✅ Página de empleados (debe tener export default)
import DepartamentosPage from "../features/departamentos/pages/DepartamentosPage";
import PuestosPage from "../features/puestos/pages/PuestosPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";
import NominaPage from "../features/nomina/pages/NominaPage";
import NominaDetallePage from "../features/nomina/pages/NominaDetallePage";
import LoginPage from "../features/auth/pages/LoginPage";
import InicioPage from "../features/inicio/pages/InicioPage";
import PrivateRoute from "./PrivateRoute";
import { MainLayout } from "../components/layout/MainLayout";

export default function AppRouter() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/*  Rutas protegidas con layout principal */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/inicio" replace />} />

        {/* Páginas del sistema */}
        <Route path="/inicio" element={<InicioPage />} />
        <Route path="/empleados" element={<EmpleadosPage />} />
        <Route path="/departamentos" element={<DepartamentosPage />} />
        <Route path="/puestos" element={<PuestosPage />} />
        <Route path="/nomina" element={<NominaPage />} />
       <Route path="/nomina/detalle/:periodo" element={<NominaDetallePage />} />

        <Route path="/reportes" element={<ReportesPage />} />
      </Route>

      {/* 🚫 Página 404 */}
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
