import React from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
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
  FileText,
  X,
  DollarSign,
  IdCard,
  Users,
  Heart,
} from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  empleado: Empleado;
  onVerExpediente?: (empleadoId: number) => void;
}

export const EmpleadoPerfilModal: React.FC<Props> = ({
  show,
  onClose,
  empleado,
  onVerExpediente,
}) => {
  if (!empleado) return null;

  return (
    <Modal 
      show={show} 
      onClose={onClose} 
      title="Perfil del Empleado"
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            icon={<X size={18} />}
          >
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onVerExpediente) {
                onVerExpediente(empleado.id);
              }
            }}
            icon={<FileText size={18} />}
          >
            Ver Expediente
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header con avatar e info básica */}
        <Card padding="lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar circular con iniciales */}
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0"
              style={{ 
                background: "linear-gradient(135deg, #023778 0%, #034ea2 100%)" 
              }}
            >
              {empleado.nombres.charAt(0)}
              {empleado.apellidos.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {empleado.nombres} {empleado.apellidos}
              </h2>

              <div className="flex flex-col gap-2 mt-3">
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <Briefcase size={18} className="text-gray-400" />
                  <span className="font-medium">{empleado.nombrePuesto || "Sin puesto asignado"}</span>
                </p>

                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <Building2 size={18} className="text-gray-400" />
                  <span className="font-medium">{empleado.nombreDepartamento || "Sin departamento"}</span>
                </p>
              </div>

              <div className="mt-4 flex justify-center md:justify-start">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${
                    empleado.activo 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    empleado.activo ? "bg-green-500" : "bg-gray-500"
                  }`} />
                  {empleado.estadoLaboral}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid de información */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <Card>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#023778" }}
              >
                <User2 size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Información Personal
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <IdCard size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">DPI</p>
                  <p className="text-sm font-medium text-gray-900">{empleado.dpi}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Género</p>
                  <p className="text-sm font-medium text-gray-900">
                    {empleado.genero === "M" ? "Masculino" : "Femenino"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Estado Civil</p>
                  <p className="text-sm font-medium text-gray-900">{empleado.estadoCivil}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarClock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Fecha de Ingreso</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(empleado.fechaIngreso).toLocaleDateString("es-GT", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contacto */}
          <Card>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#023778" }}
              >
                <ShieldCheck size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contacto</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 uppercase">Correo Electrónico</p>
                  <p className="text-sm font-medium text-gray-900 break-words">{empleado.email}</p>
                </div>
              </div>

              {empleado.telefono && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Teléfono</p>
                    <p className="text-sm font-medium text-gray-900">{empleado.telefono}</p>
                  </div>
                </div>
              )}

              {empleado.direccion && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase">Dirección</p>
                    <p className="text-sm font-medium text-gray-900">{empleado.direccion}</p>
                  </div>
                </div>
              )}

              {!empleado.telefono && !empleado.direccion && (
                <p className="text-sm text-gray-400 italic">
                  Información de contacto adicional no disponible
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Información Laboral */}
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: "#023778" }}
            >
              <Briefcase size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Información Laboral
            </h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Building2 size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Departamento</p>
                <p className="text-sm font-medium text-gray-900">
                  {empleado.nombreDepartamento || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Puesto</p>
                <p className="text-sm font-medium text-gray-900">
                  {empleado.nombrePuesto || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Salario Base</p>
                <p className="text-sm font-medium text-gray-900">
                  {empleado.salarioBase 
                    ? `Q${empleado.salarioBase.toLocaleString('es-GT', { minimumFractionDigits: 2 })}` 
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Estado</p>
                <p className={`text-sm font-semibold ${
                  empleado.activo ? "text-green-600" : "text-gray-400"
                }`}>
                  {empleado.activo ? "Activo" : "Inactivo"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};