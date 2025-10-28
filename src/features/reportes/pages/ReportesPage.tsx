/** @jsxImportSource react */
import * as React from "react";
import { useState, useEffect } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";
import { Modal } from "../../../components/ui/Modal";
import { reportesService } from "../../../services/reportes.service";
import type { ReporteNomina, ReporteDocumentos } from "../../../models/reporte.model";

export default function ReportesPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"nominas" | "documentos">("nominas");
  const [nominas, setNominas] = useState<ReporteNomina[]>([]);
  const [documentos, setDocumentos] = useState<ReporteDocumentos[]>([]);
  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState<ReporteNomina | ReporteDocumentos | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        if (activeTab === "nominas") {
          const data = await reportesService.obtenerNominas();
          setNominas(Array.isArray(data) ? data : []);
        } else {
          const data = await reportesService.obtenerDocumentos();
          setDocumentos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("❌ Error al cargar el reporte:", err);
        alert("Error al cargar el reporte");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [activeTab]);

  // === Loader simple ===
  if (loading) {
    return (
      <p className="text-center mt-10 text-lg text-gray-600 dark:text-gray-300 animate-pulse">
        Cargando reportes...
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        📊 Reportes
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={activeTab === "nominas" ? "primary" : "secondary"}
          onClick={() => setActiveTab("nominas")}
        >
          Nóminas
        </Button>
        <Button
          variant={activeTab === "documentos" ? "primary" : "secondary"}
          onClick={() => setActiveTab("documentos")}
        >
          Documentos
        </Button>
      </div>

      {/* Contenido dinámico */}
      <Card variant="outlined" hoverable>
        {activeTab === "nominas" && nominas.length > 0 ? (
          <>
            <Table
              columns={[
                { key: "empleado", label: "Empleado" },
                { key: "departamento", label: "Departamento" },
                { key: "periodo", label: "Periodo" },
                { key: "salarioBase", label: "Salario Base (Q)" },
                { key: "totalBonificaciones", label: "Bonificaciones (Q)" },
                { key: "totalDescuentos", label: "Descuentos (Q)" },
                { key: "sueldoLiquido", label: "Sueldo Líquido (Q)" },
              ]}
              data={nominas}
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {nominas.map((n) => (
                <Button
                  key={n.idEmpleado}
                  variant="secondary"
                  onClick={() => {
                    setDetalle(n);
                    setShowModal(true);
                  }}
                >
                  👁️ Ver Detalle ({n.empleado})
                </Button>
              ))}
            </div>
          </>
        ) : activeTab === "nominas" ? (
          <p className="text-center py-6 text-gray-500">No hay datos de nómina.</p>
        ) : null}

        {activeTab === "documentos" && documentos.length > 0 ? (
          <>
            <Table
              columns={[
                { key: "empleado", label: "Empleado" },
                { key: "departamento", label: "Departamento" },
                { key: "documentosRequeridos", label: "Requeridos" },
                { key: "documentosSubidos", label: "Subidos" },
                { key: "documentosAceptados", label: "Aprobados" },
              ]}
              data={documentos}
            />
            <p className="text-xs text-gray-500 mt-3 text-right">
              * Basado en el SP: sp_reporte_documentos
            </p>
          </>
        ) : activeTab === "documentos" ? (
          <p className="text-center py-6 text-gray-500">No hay datos de documentos.</p>
        ) : null}
      </Card>

      {/* Modal Detalle */}
      <Modal
        show={showModal}
        title="Detalle del Empleado"
        onClose={() => setShowModal(false)}
      >
        {detalle && "periodo" in detalle && (
          <div className="space-y-2 text-sm">
            <p><strong>Empleado:</strong> {detalle.empleado}</p>
            <p><strong>Departamento:</strong> {detalle.departamento}</p>
            <p><strong>Periodo:</strong> {detalle.periodo}</p>
            <p><strong>Salario Base:</strong> Q{detalle.salarioBase}</p>
            <p><strong>Bonificaciones:</strong> Q{detalle.totalBonificaciones ?? 0}</p>
            <p><strong>Descuentos:</strong> Q{detalle.totalDescuentos ?? 0}</p>
            <p><strong>Sueldo Líquido:</strong> Q{detalle.sueldoLiquido}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
