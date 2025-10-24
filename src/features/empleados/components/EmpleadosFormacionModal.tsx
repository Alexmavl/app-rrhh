import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { formacionService } from "../../../services/formacion.service";
import { documentosService, Documento } from "../../../services/documentos.service";
import { tiposDocumentoService, TipoDocumento } from "../../../services/tiposDocumento.service"; // ✅ corregido
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { swalConfig } from "../../../utils/swalConfig";
import { AuthContext } from "../../../context/AuthContext";

interface Props {
  empleadoId: number;
  show: boolean;
  onClose: () => void;
}

interface FormacionInput {
  nivel: string;
  institucion: string;
  titulo: string;
  anioFinalizacion: number;
}

export function EmpleadosFormacionModal({ empleadoId, show, onClose }: Props) {
  const [tab, setTab] = useState<"formacion" | "documentos">("formacion");
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormacionInput>();
  const auth = useContext(AuthContext);

  // 📘 Formación
  const { data: formaciones = [] } = useQuery({
    queryKey: ["formacion", empleadoId],
    queryFn: () => formacionService.listar(),
  });

  // 📄 Documentos
  const { data: documentos = [] } = useQuery<Documento[]>({
    queryKey: ["documentos", empleadoId],
    queryFn: () => documentosService.listarPorEmpleado(empleadoId),
  });

  // 📂 Tipos de Documento
  const { data: tiposDocumento = [] } = useQuery<TipoDocumento[]>({
    queryKey: ["tiposDocumento"],
    queryFn: tiposDocumentoService.listar,
  });

  // 🧾 Crear formación
  const crearFormacion = useMutation({
    mutationFn: async (data: FormacionInput) => {
      if (!auth?.user) throw new Error("No hay sesión activa.");

      await formacionService.crear({
        idEmpleado: empleadoId,
        usuarioEjecutorId: auth.user.id,
        rolEjecutor: auth.user.rol,
        ...data,
      });
    },
    onSuccess: async () => {
      await swalConfig.fire({
        icon: "success",
        title: "Formación agregada",
        text: "Se ha registrado correctamente la formación académica.",
      });
      queryClient.invalidateQueries({ queryKey: ["formacion", empleadoId] });
      reset();
    },
    onError: async (err: any) => {
      await swalConfig.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Error al guardar la formación.",
      });
    },
  });

  // 📤 Subir documento
  const subirDocumento = useMutation({
    mutationFn: async (fileData: FormData) => {
      await documentosService.subir(fileData);
    },
    onSuccess: async () => {
      await swalConfig.fire({
        icon: "success",
        title: "Documento subido",
        text: "El archivo fue registrado correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["documentos", empleadoId] });
    },
    onError: async (err: any) => {
      await swalConfig.fire({
        icon: "error",
        title: "Error al subir archivo",
        text: err.response?.data?.message || "No se pudo subir el documento.",
      });
    },
  });

  // 📁 Subida de archivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const tipo = (document.getElementById("idTipoDocumento") as HTMLSelectElement)?.value;

    if (!file || !auth?.user || !tipo) {
      swalConfig.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Seleccione un tipo de documento antes de subir el archivo.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("idEmpleado", empleadoId.toString());
    formData.append("idTipoDocumento", tipo);
    formData.append("nombreArchivo", file.name);
    formData.append("rutaArchivo", `uploads/empleados/academicos/${file.name}`);
    formData.append("usuarioEjecutorId", auth.user.id.toString());
    formData.append("rolEjecutor", auth.user.rol);
    formData.append("file", file);

    subirDocumento.mutate(formData);
  };

  const onSubmit = handleSubmit(async (data) => {
    crearFormacion.mutate(data);
  });

  return (
    <Modal show={show} onClose={onClose} title="Formación y Documentos Académicos">
      {/* Tabs */}
      <div className="flex gap-3 border-b mb-4">
        <button
          onClick={() => setTab("formacion")}
          className={`px-3 py-2 font-medium ${
            tab === "formacion"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Formación Académica
        </button>
        <button
          onClick={() => setTab("documentos")}
          className={`px-3 py-2 font-medium ${
            tab === "documentos"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Documentos
        </button>
      </div>

      {/* Formación */}
      {tab === "formacion" ? (
        <div>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input label="Nivel" {...register("nivel", { required: true })} />
            <Input label="Institución" {...register("institucion", { required: true })} />
            <Input label="Título" {...register("titulo", { required: true })} />
            <Input
              label="Año de finalización"
              type="number"
              {...register("anioFinalizacion", { required: true })}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={crearFormacion.isPending}>
                {crearFormacion.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>

          <table className="w-full border-t mt-4 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Nivel</th>
                <th className="p-2">Institución</th>
                <th className="p-2">Título</th>
                <th className="p-2">Año</th>
              </tr>
            </thead>
            <tbody>
              {formaciones.map((f: any) => (
                <tr key={f.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{f.nivel}</td>
                  <td className="p-2">{f.institucion}</td>
                  <td className="p-2">{f.titulo}</td>
                  <td className="p-2">{f.anioFinalizacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Documentos
        <div>
          <div className="flex flex-col gap-2 mb-3">
            <label className="text-sm font-medium text-gray-700">Tipo de documento</label>
            <select id="idTipoDocumento" className="border rounded-lg p-2 w-full" defaultValue="">
              <option value="">Seleccione tipo de documento</option>
              {tiposDocumento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre} — {tipo.categoria}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          {documentos.length > 0 ? (
            <table className="w-full border-t mt-4 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Archivo</th>
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => (
                  <tr key={doc.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{doc.nombreArchivo}</td>
                    <td className="p-2">{doc.tipoDocumentoNombre || "-"}</td>
                    <td className="p-2">{new Date(doc.fechaSubida).toLocaleDateString()}</td>
                    <td className="p-2">
                      <a
                        href={`/${doc.rutaArchivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Ver
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic mt-3">No hay documentos cargados.</p>
          )}
        </div>
      )}
    </Modal>
  );
}
