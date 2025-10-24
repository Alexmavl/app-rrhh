import React from "react";
import { Modal } from "../../../components/ui/Modal";
import type { Empleado } from "../../../models/empleado.model";
import {
  Mail,
  Phone,
  MapPin,
  CalendarClock,
  Briefcase,
  Building2,
  User2,
  ShieldCheck,
} from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  empleado: Empleado;
  onVerExpediente?: (empleadoId: number) => void; // ✅ callback al modal de formación
}

export const EmpleadoPerfilModal: React.FC<Props> = ({
  show,
  onClose,
  empleado,
  onVerExpediente,
}) => {
  if (!empleado) return null;

  return (
    <Modal show={show} onClose={onClose} title="Perfil del Empleado">
      {/* 🔹 Header con avatar e info básica */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-gray-200">
        {/* Avatar circular con iniciales */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {empleado.nombres.charAt(0)}
          {empleado.apellidos.charAt(0)}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            {empleado.nombres} {empleado.apellidos}
          </h2>

          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
            <Briefcase size={18} /> {empleado.nombrePuesto || "Sin puesto asignado"}
          </p>

          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
            <Building2 size={18} /> {empleado.nombreDepartamento || "Sin departamento"}
          </p>

          <div
            className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white ${
              empleado.activo ? "bg-green-600" : "bg-gray-500"
            }`}
          >
            {empleado.estadoLaboral}
          </div>
        </div>
      </div>

      {/* 📊 Información personal */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
            <User2 size={18} /> Información Personal
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <strong>DPI:</strong> {empleado.dpi}
            </li>
            <li>
              <strong>Género:</strong>{" "}
              {empleado.genero === "M" ? "Masculino" : "Femenino"}
            </li>
            <li>
              <strong>Estado Civil:</strong> {empleado.estadoCivil}
            </li>
            <li className="flex items-center gap-2 text-gray-600 mt-2">
              <CalendarClock size={16} />
              Fecha de Ingreso:{" "}
              <span className="font-medium text-gray-800">
                {new Date(empleado.fechaIngreso).toLocaleDateString("es-GT")}
              </span>
            </li>
          </ul>
        </div>

        {/* ☎️ Contacto */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
            <ShieldCheck size={18} /> Contacto
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-gray-500" />
              <span>{empleado.email}</span>
            </li>
            {empleado.telefono && (
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span>{empleado.telefono}</span>
              </li>
            )}
            {empleado.direccion && (
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{empleado.direccion}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 💼 Información laboral */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
          <Briefcase size={18} /> Información Laboral
        </h3>
        <ul className="grid sm:grid-cols-2 gap-y-2 text-gray-700 text-sm">
          <li>
            <strong>Departamento:</strong> {empleado.nombreDepartamento || "-"}
          </li>
          <li>
            <strong>Puesto:</strong> {empleado.nombrePuesto || "-"}
          </li>
          <li>
            <strong>Salario Base:</strong>{" "}
            {empleado.salarioBase ? `Q${empleado.salarioBase.toFixed(2)}` : "-"}
          </li>
          <li>
            <strong>Estado:</strong>{" "}
            <span
              className={`font-medium ${
                empleado.activo ? "text-green-600" : "text-gray-400"
              }`}
            >
              {empleado.activo ? "Activo" : "Inactivo"}
            </span>
          </li>
        </ul>
      </div>

      {/* 🔚 Footer con dos botones */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm"
        >
          Cerrar
        </button>

        <button
          onClick={() => {
            onClose();
            if (onVerExpediente) onVerExpediente(empleado.id);
          }}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm flex items-center gap-2"
        >
          📂 Ver Expediente
        </button>
      </div>
    </Modal>
  );
};
