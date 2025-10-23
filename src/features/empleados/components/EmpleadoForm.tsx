import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { empleadosService } from "../../../services/empleados.service";
import { departamentosService } from "../../../services/departamentos.service";
import { puestosService } from "../../../services/puestos.service";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { swalConfig } from "../../../utils/swalConfig";
import type { Empleado } from "../../../models/empleado.model";

const schema = z.object({
  nombres: z.string().min(2, "El nombre es obligatorio"),
  apellidos: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Correo inválido"),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  idDepartamento: z.number().min(1, "Seleccione un departamento"),
  idPuesto: z.number().min(1, "Seleccione un puesto"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  empleado?: Empleado | null;
  onSuccess: () => void;
}

export function EmpleadoForm({ empleado, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: empleado || {},
  });

  // 🔹 Cargar departamentos y puestos
  const { data: departamentos = [] } = useQuery({
    queryKey: ["departamentos"],
    queryFn: departamentosService.listar,
  });

  const { data: puestos = [] } = useQuery({
    queryKey: ["puestos"],
    queryFn: puestosService.listar,
  });

  // 💾 Crear o editar empleado
  const onSubmit = async (data: FormData) => {
    try {
      if (empleado) {
        await empleadosService.editar(empleado.id, data);
        await swalConfig.fire({
          icon: "success",
          title: "Empleado actualizado",
          text: "Los datos del empleado se modificaron correctamente.",
        });
      } else {
        await empleadosService.crear({
          ...data,
          estadoLaboral: "Activo",
        });
        await swalConfig.fire({
          icon: "success",
          title: "Empleado creado",
          text: "El nuevo empleado fue registrado con éxito.",
        });
      }
      onSuccess();
    } catch (err: any) {
      await swalConfig.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Ocurrió un error al guardar el empleado.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        label="Nombres"
        {...register("nombres")}
        error={errors.nombres?.message}
      />
      <Input
        label="Apellidos"
        {...register("apellidos")}
        error={errors.apellidos?.message}
      />
      <Input
        label="Correo"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input label="Teléfono" {...register("telefono")} />
      <Input label="Dirección" {...register("direccion")} />

      {/* 🔽 Select de departamentos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Departamento
        </label>
        <select
          {...register("idDepartamento", { valueAsNumber: true })}
          className="w-full rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        >
          <option value="">Seleccione un departamento</option>
          {departamentos.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.nombre}
            </option>
          ))}
        </select>
        {errors.idDepartamento && (
          <p className="text-red-500 text-sm mt-1">
            {errors.idDepartamento.message}
          </p>
        )}
      </div>

      {/* 🔽 Select de puestos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Puesto
        </label>
        <select
          {...register("idPuesto", { valueAsNumber: true })}
          className="w-full rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        >
          <option value="">Seleccione un puesto</option>
          {puestos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} — Q{p.salarioBase}
            </option>
          ))}
        </select>
        {errors.idPuesto && (
          <p className="text-red-500 text-sm mt-1">
            {errors.idPuesto.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </>
          ) : empleado ? (
            "Guardar cambios"
          ) : (
            "Crear empleado"
          )}
        </Button>
      </div>
    </form>
  );
}
