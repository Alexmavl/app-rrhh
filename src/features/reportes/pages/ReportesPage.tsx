/** @jsxImportSource react */
import * as React from "react";
import { useState, useEffect } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { reportesService } from "../../../services/reportes.service";
import type { ReporteNomina, ReporteDocumentos } from "../../../models/reporte.model";
import * as XLSX from "xlsx";
import { ReportePDF } from "../components/ReportePDF";
import { ReportePDFDocumentos } from "../components/ReportePDFDocumentos";
import { ReportePDFGlobal } from "../components/ReportePDFGlobal";

/**
 * 📊 Página principal de Reportes RH
 */
export default function ReportesPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"nominas" | "documentos">("nominas");
  const [nominas, setNominas] = useState<ReporteNomina[]>([]);
  const [documentos, setDocumentos] = useState<ReporteDocumentos[]>([]);
  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState<ReporteNomina | ReporteDocumentos | null>(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * 🔄 Cargar reportes según pestaña seleccionada
   */
  useEffect(() => {
    const cargarDatos = async (): Promise<void> => {
      setLoading(true);
      try {
        if (activeTab === "nominas") {
          const data = await reportesService.obtenerNominas();
          const filtradas = Array.isArray(data)
            ? data.filter(
                (n: ReporteNomina) =>
                  n.estadoEmpleado === "Activo" || n.activo === 1
              )
            : [];
          // 🔹 Evitar duplicaciones
          const unicas = filtradas.filter(
            (v, i, a) =>
              a.findIndex(
                (t) => t.idEmpleado === v.idEmpleado && t.periodo === v.periodo
              ) === i
          );
          setNominas(unicas);
        } else {
          const data = await reportesService.obtenerDocumentos();
          setDocumentos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("❌ Error al cargar reporte:", err);
        alert("Error al cargar el reporte");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [activeTab]);

  /**
   * 📗 Exportar a Excel
   */
  const exportarExcel = (): void => {
    const data = activeTab === "nominas" ? nominas : documentos;
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === "nominas" ? "Nóminas" : "Documentos");
    XLSX.writeFile(wb, `reporte_${activeTab}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  
  


  /**
   * 👁️ Ver detalle de empleado/documentos
   */
  const abrirDetalle = (item: ReporteNomina | ReporteDocumentos): void => {
    setDetalle(item);
    setShowModal(true);
  };

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
        📊 Reportes Institucionales RH
      </h1>

      {/* Pestañas */}
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

      {/* Botones de exportación */}
      <div className="flex justify-end gap-3 mb-4">
        <Button variant="success" onClick={exportarExcel}>
          📗 Exportar Excel
        </Button>

        {activeTab === "nominas" && nominas.length > 0 && (
          <ReportePDF nominas={nominas} />
        )}

        {activeTab === "documentos" && documentos.length > 0 && (
          <ReportePDFDocumentos reportes={documentos} />
        )}

        {nominas.length > 0 || documentos.length > 0 ? (
          <ReportePDFGlobal nominas={nominas} documentos={documentos} />
        ) : (
          <Button variant="warning" disabled>
            📑 Reporte Global (sin datos)
          </Button>
        )}
      </div>

      {/* Tabla principal */}
      <Card variant="outlined" hoverable>
        <div className="overflow-x-auto">
          {activeTab === "nominas" && nominas.length > 0 ? (
            <table className="min-w-full border-collapse text-sm text-gray-800">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-3 py-2">Empleado</th>
                  <th className="px-3 py-2">Departamento</th>
                  <th className="px-3 py-2">Periodo</th>
                  <th className="px-3 py-2 text-right">Salario Base (Q)</th>
                  <th className="px-3 py-2 text-right">Bonificaciones (Q)</th>
                  <th className="px-3 py-2 text-right">Descuentos (Q)</th>
                  <th className="px-3 py-2 text-right">Sueldo Líquido (Q)</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {nominas.map((n) => (
                  <tr key={`${n.idEmpleado}-${n.periodo}`} className="border-b hover:bg-blue-50">
                    <td className="px-3 py-2">{n.empleado}</td>
                    <td className="px-3 py-2">{n.departamento}</td>
                    <td className="px-3 py-2">{n.periodo}</td>
                    <td className="px-3 py-2 text-right">{n.salarioBase.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">
                      {(n.totalBonificaciones ?? 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {(n.totalDescuentos ?? 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-green-700">
                      {n.sueldoLiquido.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="secondary" onClick={() => abrirDetalle(n)}>
                        👁️ Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTab === "documentos" && documentos.length > 0 ? (
            <table className="min-w-full border-collapse text-sm text-gray-800">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-3 py-2">Empleado</th>
                  <th className="px-3 py-2">Departamento</th>
                  <th className="px-3 py-2 text-center">Requeridos</th>
                  <th className="px-3 py-2 text-center">Subidos</th>
                  <th className="px-3 py-2 text-center">Aprobados</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((d) => (
                  <tr key={d.idEmpleado} className="border-b hover:bg-blue-50">
                    <td className="px-3 py-2">{d.empleado}</td>
                    <td className="px-3 py-2">{d.departamento}</td>
                    <td className="px-3 py-2 text-center">{d.documentosRequeridos}</td>
                    <td className="px-3 py-2 text-center">{d.documentosSubidos}</td>
                    <td className="px-3 py-2 text-center text-green-700 font-semibold">
                      {d.documentosAceptados}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button size="sm" variant="secondary" onClick={() => abrirDetalle(d)}>
                        👁️ Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-6 text-gray-500">
              No hay datos disponibles en {activeTab}.
            </p>
          )}
        </div>
      </Card>

      {/* Modal Detalle */}
      {detalle && (
        <Modal show={showModal} title="Detalle del Empleado" onClose={() => setShowModal(false)}>
          {"periodo" in detalle ? (
            <div className="space-y-2 text-sm">
              <p><strong>Empleado:</strong> {detalle.empleado}</p>
              <p><strong>Departamento:</strong> {detalle.departamento}</p>
              <p><strong>Periodo:</strong> {detalle.periodo}</p>
              <p><strong>Salario Base:</strong> Q{detalle.salarioBase}</p>
              <p><strong>Bonificaciones:</strong> Q{detalle.totalBonificaciones ?? 0}</p>
              <p><strong>Descuentos:</strong> Q{detalle.totalDescuentos ?? 0}</p>
              <p><strong>Sueldo Líquido:</strong> Q{detalle.sueldoLiquido}</p>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>Empleado:</strong> {detalle.empleado}</p>
              <p><strong>Departamento:</strong> {detalle.departamento}</p>

              <p className="font-semibold text-blue-700 mt-3"> Documentos Subidos:</p>
              <ul className="list-disc ml-5 text-gray-700">
                {(detalle as ReporteDocumentos).nombresSubidos
                  ? (detalle as ReporteDocumentos).nombresSubidos!.split(",").map(
                      (n: string, i: number) => <li key={i}>{n.trim()}</li>
                    )
                  : <li>No se ha subido ningún documento</li>}
              </ul>

              <p className="font-semibold text-red-700 mt-3">⚠️ Documentos Faltantes:</p>
              <ul className="list-disc ml-5 text-gray-700">
                {(detalle as ReporteDocumentos).nombresFaltantes
                  ? (detalle as ReporteDocumentos).nombresFaltantes!.split(",").map(
                      (n: string, i: number) => <li key={i}>{n.trim()}</li>
                    )
                  : <li>No hay documentos pendientes</li>}
              </ul>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
