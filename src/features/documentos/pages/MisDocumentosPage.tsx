import React, { useEffect, useState } from "react";
import { documentosService } from "../../../services/documentos.service";
import { tiposDocumentoService } from "../../../services/tiposDocumento.service";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { FileText, Upload, Eye, CheckCircle, XCircle } from "lucide-react";
import { swalError, swalSuccess } from "../../../utils/swalConfig";

export default function MisDocumentosPage() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [detalleExpediente, setDetalleExpediente] = useState<any[]>([]);

  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  // 🔹 Cargar tipos y documentos
  const fetchData = async () => {
    try {
      setLoading(true);
      const [tipos, docs] = await Promise.all([
        tiposDocumentoService.listar(),
        documentosService.listarPorEmpleado(usuario.id),
      ]);

      setTiposDocumento(tipos);
      setDocumentos(docs);
    } catch (err) {
      swalError("Error", "No se pudieron cargar los documentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📤 Subir documento
  const handleUpload = async () => {
    if (!file) return swalError("Advertencia", "Debes seleccionar un archivo.");
    if (!tipoSeleccionado)
      return swalError("Advertencia", "Debes seleccionar un tipo de documento.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("idEmpleado", usuario.id);
      formData.append("idTipoDocumento", tipoSeleccionado);
      formData.append("nombreArchivo", file.name);
      formData.append("usuarioEjecutorId", usuario.id);
      formData.append("rolEjecutor", usuario.rol);

      await documentosService.subir(formData);

      swalSuccess("Éxito", "Documento subido correctamente.");
      setFile(null);
      setTipoSeleccionado("");
      fetchData();
    } catch (err: any) {
      swalError("Error", err.response?.data?.message || "Error al subir documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FileText size={28} className="text-blue-700" />
          <h1 className="text-2xl font-bold text-gray-900">
            {usuario.rol === "Empleado" ? "Mis Documentos" : "Gestión de Documentos"}
          </h1>
        </div>

        {(usuario.rol === "Empleado" || usuario.rol === "RRHH") && (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
            >
              <option value="">Seleccione tipo de documento</option>
              {tiposDocumento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre} — {tipo.categoria}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
            />

            <Button
              onClick={handleUpload}
              variant="primary"
              icon={<Upload size={16} />}
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Subir Documento"}
            </Button>
          </div>
        )}
      </Card>

      <Card padding="none">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Cargando...</p>
        ) : documentos.length === 0 ? (
          <p className="text-center text-gray-600 py-6">
            No hay documentos para mostrar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-3 py-3 text-left">#</th>
                  <th className="px-3 py-3 text-left">Nombre</th>
                  <th className="px-3 py-3 text-left">Tipo</th>
                  <th className="px-3 py-3 text-left">Fecha</th>
                  <th className="px-3 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {documentos.map((doc, i) => (
                  <tr key={i}>
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3">{doc.nombreArchivo}</td>
                    <td className="px-3 py-3">{doc.tipoDocumentoNombre || "N/A"}</td>
                    <td className="px-3 py-3">
                      {new Date(doc.fechaSubida).toLocaleDateString("es-GT")}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Button
                        size="sm"
                        variant="info"
                        icon={<Eye size={14} />}
                        onClick={() =>
                          window.open(`/api/documentos/ver/${doc.id}`, "_blank")
                        }
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
