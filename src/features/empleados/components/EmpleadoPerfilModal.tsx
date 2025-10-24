import React from "react";
import { Modal } from "../../../components/ui/Modal";
import type { Empleado } from "../../../models/empleado.model";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  User2,
  ShieldCheck,
} from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  empleado: Empleado;
}

export const EmpleadoPerfilModal: React.FC<Props> = ({ show, onClose, empleado }) => {
  if (!empleado) return null;

  return (
    <Modal show={show} onClose={onClose} title="Perfil del Empleado" size="xl">
      {/* 🧩 Header con foto y nombre */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-gray-200">
        {/* Foto del empleado (placeholder si no tiene) */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {empleado.nombres.charAt(0)}
          {empleado.apellidos.charAt(0)}
        </div>

        {/* Información principal */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            {empleado.nombres} {empleado.apellidos}
          </h2>
          <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-1">
            <Briefcase size={16} />
            {empleado.nombrePuesto || "Sin puesto asignado"}
          </p>
          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1">
            <Building2 size={16} />
            {empleado.nombreDepartamento || "Sin departamento"}
          </p>

          <div className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-blue-600">
            {empleado.estadoLaboral}
          </div>
        </div>
      </div>

      {/* 📊 Información detallada */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Información personal */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
            <User2 size={18} />
            Información Personal
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <strong>DPI:</strong> {empleado.dpi}
            </li>
            <li>
              <strong>Género:</strong> {empleado.genero === "M" ? "Masculino" : "Femenino"}
            </li>
            <li>
              <strong>Estado Civil:</strong> {empleado.estadoCivil}
            </li>
            <li className="flex items-center gap-2 text-gray-600 mt-2">
              <Calendar size={16} />
              Fecha de Ingreso:{" "}
              <span className="font-medium text-gray-800">
                {new Date(empleado.fechaIngreso).toLocaleDateString()}
              </span>
            </li>
          </ul>
        </div>

        {/* Información de contacto */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
            <ShieldCheck size={18} />
            Contacto
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

      {/* 🧭 Footer */}
      <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};
