// src/features/empleados/components/EmpleadoForm.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { empleadosService } from "../../../services/empleados.service";
import type { Empleado } from "../../../models/empleado.model";

const schema = z.object({
  nombres: z.string().min(2, "El nombre es obligatorio"),
  apellidos: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Correo inválido"),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  idDepartamento: z.coerce.number().int().min(1, "Seleccione un departamento"),
  idPuesto: z.coerce.number().int().min(1, "Seleccione un puesto"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  empleado?: Empleado | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmpleadoForm({ empleado, onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: empleado || {},
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (empleado) {
        await empleadosService.editar(empleado.id, data);
        alert("Empleado actualizado correctamente");
      } else {
        await empleadosService.crear(data);
        alert("Empleado creado correctamente");
      }
      reset();
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al guardar empleado");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input label="Nombres" {...register("nombres")} />
      {errors.nombres && <p className="text-red-600 text-sm">{errors.nombres.message}</p>}

      <Input label="Apellidos" {...register("apellidos")} />
      {errors.apellidos && <p className="text-red-600 text-sm">{errors.apellidos.message}</p>}

      <Input label="Correo electrónico" type="email" {...register("email")} />
      {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

      <Input label="Teléfono" {...register("telefono")} />
      <Input label="Dirección" {...register("direccion")} />

      <Input label="ID Departamento" type="number" {...register("idDepartamento")} />
      {errors.idDepartamento && (
        <p className="text-red-600 text-sm">{errors.idDepartamento.message}</p>
      )}

      <Input label="ID Puesto" type="number" {...register("idPuesto")} />
      {errors.idPuesto && (
        <p className="text-red-600 text-sm">{errors.idPuesto.message}</p>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {empleado ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
