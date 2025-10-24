import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { formacionService } from "../../../services/formacion.service";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { swalConfig } from "../../../utils/swalConfig";

interface Props {
  empleadoId: number;
  show: boolean;
  onClose: () => void;
}

export function EmpleadoFormacionModal({ empleadoId, show, onClose }: Props) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  
  const { data: formaciones = [] } = useQuery({
    queryKey: ["formacion", empleadoId],
    queryFn: () => formacionService.listar(),
  });

  const crearFormacion = useMutation({
    mutationFn: async (data: any) => {
      await formacionService.crear({
        idEmpleado: empleadoId,
        usuarioEjecutorId: 1, // reemplazar con el user real del contexto
        rolEjecutor: "Admin",
        ...data,
      });
    },
    onSuccess: async () => {
      await swalConfig.fire({
        icon: "success",
        title: "Formación agregada",
        text: "Se ha registrado correctamente la formación.",
      });
      queryClient.invalidateQueries({ queryKey: ["formacion", empleadoId] });
      reset();
    },
    onError: async (err: any) => {
      await swalConfig.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Error al registrar la formación.",
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    crearFormacion.mutate(data);
  });

  return (
    <Modal show={show} onClose={onClose} title="Formación Académica">
      <div className="space-y-4">
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
            <Button type="submit">Guardar</Button>
          </div>
        </form>

        {formaciones.length > 0 ? (
          <table className="w-full border-t mt-4 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Nivel</th>
                <th className="p-2">Institución</th>
                <th className="p-2">Título</th>
                <th className="p-2">Año</th>
              </tr>
            </thead>
            <tbody>
              {formaciones.map((f) => (
                <tr key={f.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{f.nivel}</td>
                  <td className="p-2">{f.institucion}</td>
                  <td className="p-2">{f.titulo}</td>
                  <td className="p-2">{f.anioFinalizacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-sm mt-3">No hay formación registrada.</p>
        )}
      </div>
    </Modal>
  );
}
