import { Routes, Route, Navigate } from "react-router-dom";
import EmpleadosPage from "../features/empleados/pages/EmpleadosPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";
import NominaPage from "../features/nomina/pages/NominaPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/empleados" />} />
      <Route path="/empleados" element={<EmpleadosPage />} />
      <Route path="/reportes" element={<ReportesPage />} />
      <Route path="/nomina" element={<NominaPage />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}
