import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { formacionService } from "../../../services/formacion.service";
import { documentosService } from "../../../services/documentos.service";
import type { Documento } from "../../../models/documento.model";
import { tiposDocumentoService, TipoDocumento } from "../../../services/tiposDocumento.service";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { 
  swalSuccess, 
  swalError, 
  swalConfirm, 
  swalWarning,
  swalLoading,
  swalClose 
} from "../../../utils/swalConfig";
import { AuthContext } from "../../../context/AuthContext";
import {
  GraduationCap,
  FileText,
  Plus,
  Edit,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  Calendar,
  Building2,
  Award,
  Save,
  ClipboardCheck,
  List,
} from "lucide-react";

interface Props {
  empleadoId: number;
  show: boolean;
  onClose: () => void;
}

interface FormacionInput {
  nivel: string;
  institucion: string;
  titulo: string;
  anioFinalizacion: number | string;
}

export function EmpleadosFormacionModal({ empleadoId, show, onClose }: Props) {
  const [tab, setTab] = useState<"formacion" | "documentos">("formacion");
  const [selectedFormacion, setSelectedFormacion] = useState<any | null>(null);
  const [detalleExpediente, setDetalleExpediente] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormacionInput>();
  const auth = useContext(AuthContext);

  /* Queries */
  const { data: formaciones = [], isLoading: loadingFormacion } = useQuery({
    queryKey: ["formacion", empleadoId],
    queryFn: () => formacionService.listar(empleadoId),
  });

  const { data: documentos = [], isLoading: loadingDocs } = useQuery<Documento[]>({
    queryKey: ["documentos", empleadoId],
    queryFn: () => documentosService.listarPorEmpleado(empleadoId),
  });

  const { data: tiposDocumento = [] } = useQuery<TipoDocumento[]>({
    queryKey: ["tiposDocumento"],
    queryFn: tiposDocumentoService.listar,
  });

  /* Crear formación */
  const crearFormacion = useMutation({
    mutationFn: async (data: FormacionInput) => {
      if (!auth?.user) throw new Error("No hay sesión activa.");
      const payload = {
        idEmpleado: empleadoId,
        nivel: data.nivel.trim(),
        institucion: data.institucion.trim(),
        titulo: data.titulo.trim(),
        anioFinalizacion: Number(data.anioFinalizacion),
        usuarioEjecutorId: Number(auth.user.id),
        rolEjecutor: auth.user.rol,
      };
      await formacionService.crear(payload);
    },
    onSuccess: async () => {
      await swalSuccess("Formación agregada", "Se ha registrado correctamente la formación académica.");
      queryClient.invalidateQueries({ queryKey: ["formacion", empleadoId] });
      reset();
    },
    onError: async (err: any) => {
      await swalError("Error", err.response?.data?.message || "Error al guardar la formación.");
    },
  });

  /* Editar formación */
  const editarFormacion = useMutation({
    mutationFn: async (data: FormacionInput) => {
      if (!auth?.user || !selectedFormacion) throw new Error("Datos incompletos.");
      const payload = {
        idEmpleado: empleadoId,
        nivel: data.nivel.trim(),
        institucion: data.institucion.trim(),
        titulo: data.titulo.trim(),
        anioFinalizacion: Number(data.anioFinalizacion),
        usuarioEjecutorId: Number(auth.user.id),
        rolEjecutor: auth.user.rol,
      };
      await formacionService.editar(selectedFormacion.id, payload);
    },
    onSuccess: async () => {
      await swalSuccess("Formación actualizada", "El registro fue modificado correctamente.");
      setSelectedFormacion(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ["formacion", empleadoId] });
    },
    onError: async (err: any) => {
      await swalError("Error", err.response?.data?.message || "Error al actualizar la formación.");
    },
  });

  /* Toggle formación */
  const toggleFormacion = async (id: number, activo: boolean) => {
    if (!auth?.user) return;
    const result = await swalConfirm(
      activo ? "¿Inactivar formación?" : "¿Activar formación?",
      activo ? "Esta formación quedará inactiva." : "Esta formación volverá a estar activa.",
      activo ? "Inactivar" : "Activar",
      "Cancelar"
    );
    if (result.isConfirmed) {
      await formacionService.toggleActivo(id, {
        usuarioEjecutorId: auth.user.id,
        rolEjecutor: auth.user.rol,
      });
      await swalSuccess(
        activo ? "Formación inactivada" : "Formación activada",
        "El estado se actualizó correctamente."
      );
      queryClient.invalidateQueries({ queryKey: ["formacion", empleadoId] });
    }
  };

  /* Subir documento */
  const subirDocumento = useMutation({
    mutationFn: async (formData: FormData) => {
      await documentosService.subir(formData);
    },
    onSuccess: async () => {
      await swalSuccess("Documento subido", "El archivo fue registrado correctamente.");
      queryClient.invalidateQueries({ queryKey: ["documentos", empleadoId] });
    },
    onError: async (err: any) => {
      await swalError("Error al subir archivo", err.response?.data?.message || "No se pudo subir el documento.");
    },
  });

  /* Upload handler */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const tipo = (document.getElementById("idTipoDocumento") as HTMLSelectElement)?.value;

    if (!file || !auth?.user || !tipo) {
      swalWarning("Faltan datos", "Seleccione un tipo de documento antes de subir el archivo.");
      return;
    }

    const extensionesPermitidas = ["pdf", "jpg", "jpeg", "png"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !extensionesPermitidas.includes(extension)) {
      swalError("Tipo de archivo no permitido", "Solo se permiten archivos PDF, JPG, JPEG o PNG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      swalError("Archivo demasiado grande", "El tamaño máximo permitido es 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("idEmpleado", empleadoId.toString());
    formData.append("idTipoDocumento", tipo);
    formData.append("nombreArchivo", file.name);
    formData.append("usuarioEjecutorId", auth.user.id.toString());
    formData.append("rolEjecutor", auth.user.rol);

    subirDocumento.mutate(formData);
  };

/* Toggle documento */
const toggleDocumento = async (id: number, activo: boolean) => {
  if (!auth?.user) return;
  const result = await swalConfirm(
    activo ? "¿Inactivar documento?" : "¿Activar documento?",
    activo ? "Este documento quedará inactivo." : "Este documento volverá a estar activo.",
    activo ? "Inactivar" : "Activar",
    "Cancelar"
  );
  if (result.isConfirmed) {
    await documentosService.toggle(id, {
      usuarioEjecutorId: auth.user.id,
      rolEjecutor: auth.user.rol,
    });
    await swalSuccess(
      activo ? "Documento inactivado" : "Documento activado",
      "El estado se actualizó correctamente."
    );
    queryClient.invalidateQueries({ queryKey: ["documentos", empleadoId] });
  }
};

/* Validar expediente */
const validarExpediente = async () => {
  try {
    const result = await documentosService.validarExpediente(
      empleadoId,
      auth?.user?.id ?? 0,
      auth?.user?.rol ?? "Desconocido"
    );
    if (result.expedienteCompleto) {
      await swalSuccess(
        "Expediente completo",
        `Todos los documentos (${result.totalSubidos}/${result.totalRequeridos}) están cargados.`
      );
    } else {
      const faltantes = result.totalRequeridos - result.totalSubidos;
      await swalWarning(
        "Expediente incompleto",
        `Faltan ${faltantes} documento(s) por cargar.`
      );
    }
  } catch (error: any) {
    await swalError("Error", "No se pudo validar el expediente.");
  }
};

/* Validar expediente detallado */
const validarExpedienteDetallado = async () => {
  try {
    const result = await documentosService.validarExpedienteDetallado(empleadoId);
    setDetalleExpediente(result || []);
  } catch (error: any) {
    await swalError("Error", "No se pudo obtener el detalle del expediente.");
  }
};
  /* Submit handler */
  const onSubmit = handleSubmit((data) => {
    if (selectedFormacion) {
      editarFormacion.mutate(data);
    } else {
      crearFormacion.mutate(data);
    }
  });

  return (
    <Modal show={show} onClose={onClose} size="xl">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          type="button"
          onClick={() => setTab("formacion")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
            tab === "formacion"
              ? "border-b-2 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
          style={tab === "formacion" ? { borderColor: "#023778", color: "#023778" } : undefined}
        >
          <GraduationCap size={20} />
          Formación Académica
        </button>
        <button
          type="button"
          onClick={() => setTab("documentos")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
            tab === "documentos"
              ? "border-b-2 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
          style={tab === "documentos" ? { borderColor: "#023778", color: "#023778" } : undefined}
        >
          <FileText size={20} />
          Documentos
        </button>
      </div>

      {/* Contenido */}
      {tab === "formacion" ? (
        <div className="space-y-6">
          {/* Formulario */}
          <Card>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nivel"
                  placeholder="Ej: Licenciatura"
                  leftIcon={<Award size={18} />}
                  {...register("nivel", { required: true })}
                  required
                />
                <Input
                  label="Institución"
                  placeholder="Ej: Universidad de San Carlos"
                  leftIcon={<Building2 size={18} />}
                  {...register("institucion", { required: true })}
                  required
                />
              </div>

              <Input
                label="Título"
                placeholder="Ej: Ingeniero en Sistemas"
                leftIcon={<GraduationCap size={18} />}
                {...register("titulo", { required: true })}
                required
              />

              <Input
                label="Año de finalización"
                type="number"
                placeholder="Ej: 2020"
                leftIcon={<Calendar size={18} />}
                {...register("anioFinalizacion", { required: true })}
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                {selectedFormacion && (
                  <Button
                    variant="secondary"
                    type="button"
                    icon={<X size={18} />}
                    onClick={() => {
                      setSelectedFormacion(null);
                      reset();
                    }}
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  type="submit" 
                  icon={selectedFormacion ? <Save size={18} /> : <Plus size={18} />}
                >
                  {selectedFormacion ? "Guardar cambios" : "Agregar formación"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Tabla de formaciones */}
          <Card padding="none">
            {loadingFormacion ? (
              <LoadingSpinner text="Cargando formación..." />
            ) : formaciones.length > 0 ? (
              <Table
                data={formaciones.map((f: any) => ({
                  ...f,
                  estadoBadge: (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                        f.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {f.activo ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {f.activo ? "Activo" : "Inactivo"}
                    </span>
                  ),
                  acciones: (
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="warning"
                        size="sm"
                        icon={<Edit size={14} />}
                        onClick={() => {
                          setSelectedFormacion(f);
                          reset({
                            nivel: f.nivel,
                            institucion: f.institucion,
                            titulo: f.titulo,
                            anioFinalizacion: f.anioFinalizacion,
                          });
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant={f.activo ? "danger" : "success"}
                        size="sm"
                        onClick={() => toggleFormacion(f.id, f.activo)}
                      >
                        {f.activo ? "Inactivar" : "Activar"}
                      </Button>
                    </div>
                  ),
                }))}
                columns={[
                  { key: "nivel", label: "Nivel" },
                  { key: "institucion", label: "Institución" },
                  { key: "titulo", label: "Título" },
                  { key: "anioFinalizacion", label: "Año", width: "100px", align: "center" },
                  { key: "estadoBadge", label: "Estado", width: "120px", align: "center" },
                  { key: "acciones", label: "Acciones", width: "220px", align: "center" },
                ]}
              />
            ) : (
              <div className="text-center py-12">
                <GraduationCap size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No hay formación académica registrada</p>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subir documento */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload size={20} />
              Subir Documento
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de documento <span className="text-red-500">*</span>
                </label>
                <select 
                  id="idTipoDocumento" 
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
                  defaultValue=""
                >
                  <option value="">Seleccione tipo de documento</option>
                  {tiposDocumento.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre} — {tipo.categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Archivo <span className="text-red-500">*</span>
                </label>
          <input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={handleFileUpload}
  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white file:bg-[#023778] hover:file:bg-[#0353a4] transition-all"
/>
                <p className="text-xs text-gray-500 mt-1">
                  Formatos permitidos: PDF, JPG, JPEG, PNG (Máx. 5MB)
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="info" 
                  icon={<ClipboardCheck size={18} />}
                  onClick={validarExpediente}
                >
                  Validar expediente
                </Button>
                <Button 
                  variant="secondary" 
                  icon={<List size={18} />}
                  onClick={validarExpedienteDetallado}
                >
                  Ver detalle
                </Button>
              </div>
            </div>
          </Card>

          {/* Detalle de expediente */}
          {detalleExpediente.length > 0 && (
            <Card padding="none">
              <Table
                data={detalleExpediente.map((d, i) => ({
                  ...d,
                  key: i,
                  estadoBadge: (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                        d.estado === "Subido" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.estado === "Subido" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {d.estado}
                    </span>
                  ),
                  fecha: d.fechaSubida 
                    ? new Date(d.fechaSubida).toLocaleDateString() 
                    : "-",
                }))}
                columns={[
                  { key: "tipoDocumento", label: "Tipo de Documento" },
                  { key: "estadoBadge", label: "Estado", width: "140px", align: "center" },
                  { key: "nombreArchivo", label: "Nombre" },
                  { key: "fecha", label: "Fecha", width: "120px" },
                ]}
              />
            </Card>
          )}

          {/* Tabla de documentos */}
          <Card padding="none">
            {loadingDocs ? (
              <LoadingSpinner text="Cargando documentos..." />
            ) : documentos.length > 0 ? (
              <Table
                data={documentos.map((doc) => ({
                  ...doc,
                  fecha: new Date(doc.fechaSubida).toLocaleDateString(),
                  acciones: (
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        icon={<Eye size={14} />}
                        onClick={async () => {
                          try {
                            await documentosService.ver(doc.id);
                          } catch (error) {
                            await swalError("Error", "No se pudo visualizar el archivo.");
                          }
                        }}
                      >
                        Ver
                      </Button>
                      <Button
                        variant={doc.activo ? "danger" : "success"}
                        size="sm"
                        onClick={() => toggleDocumento(doc.id, doc.activo)}
                      >
                        {doc.activo ? "Inactivar" : "Activar"}
                      </Button>
                    </div>
                  ),
                }))}
                columns={[
                  { key: "nombreArchivo", label: "Archivo" },
                  { key: "tipoDocumentoNombre", label: "Tipo" },
                  { key: "fecha", label: "Fecha", width: "120px" },
                  { key: "acciones", label: "Acciones", width: "200px", align: "center" },
                ]}
              />
            ) : (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No hay documentos cargados</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </Modal>
  );
}