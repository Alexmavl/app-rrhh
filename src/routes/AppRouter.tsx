import { Routes, Route, Navigate } from "react-router-dom";
import EmpleadosPage from "../features/empleados/pages/EmpleadosPage";
import DepartamentosPage from "../features/departamentos/pages/DepartamentosPage";
import PuestosPage from "../features/puestos/pages/PuestosPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";
import NominaPage from "../features/nomina/pages/NominaPage";
import NominaDetallePage from "../features/nomina/pages/NominaDetallePage";
import LoginPage from "../features/auth/pages/LoginPage";
import InicioPage from "../features/inicio/pages/InicioPage";
import PrivateRoute from "./PrivateRoute";
import { MainLayout } from "../components/layout/MainLayout";
import UsuariosPage from "../features/usuarios/pages/UsuariosPage";
import ForbiddenPage from "../features/auth/pages/ForbiddenPage";
import MisDocumentosPage from "../features/documentos/pages/MisDocumentosPage"; // ✅ Asegúrate de importar esto

export default function AppRouter() {
  return (
    <Routes>
      {/* 🔹 Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* 🔒 Rutas protegidas dentro del layout principal */}
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

        {/* 👇 Solo el rol "Admin" puede acceder a Usuarios */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute rolesPermitidos={["Admin"]}>
              <UsuariosPage />
            </PrivateRoute>
          }
        />

        {/*  Solo el rol "Empleado" puede acceder a Mis Documentos */}
        <Route
          path="/documentos"
          element={
            <PrivateRoute rolesPermitidos={["Admin","Empleado"]}>
              <MisDocumentosPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/*  Página de acceso denegado */}
      <Route path="/403" element={<ForbiddenPage />} />

      {/*  Página 404 (no encontrada) */}
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
