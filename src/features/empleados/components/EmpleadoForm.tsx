import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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

// ✅ Esquema de validación con tipado fuerte
const schema = z.object({
  nombres: z.string().min(2, "El nombre es obligatorio"),
  apellidos: z.string().min(2, "El apellido es obligatorio"),
  dpi: z
    .string()
    .regex(/^\d{13}$/, "El DPI debe tener exactamente 13 dígitos sin espacios ni guiones."),
  genero: z.enum(["M", "F"], { message: "Seleccione un género válido" }),
  estadoCivil: z.enum(["Soltero", "Casado", "Divorciado", "Viudo", "Unión libre"], {
    message: "Seleccione un estado civil válido",
  }),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z
    .string()
    .regex(/^\d{8,15}$/, "El teléfono debe tener entre 8 y 15 dígitos numéricos.")
    .optional(),
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .max(200, "La dirección no puede superar los 200 caracteres.")
    .optional(),

  // ✅ Tipado explícito de z.preprocess
  idDepartamento: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Seleccione un departamento")
  ) as z.ZodType<number, any, any>,
  idPuesto: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Seleccione un puesto")
  ) as z.ZodType<number, any, any>,
});

type FormData = z.infer<typeof schema>;

interface Props {
  empleado?: Empleado | null;
  onSuccess: () => void;
}

export function EmpleadoForm({ empleado, onSuccess }: Props): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: empleado || {},
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ["departamentos"],
    queryFn: departamentosService.listar,
  });

  const { data: puestos = [] } = useQuery({
    queryKey: ["puestos"],
    queryFn: puestosService.listar,
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
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
        text: err.response?.data?.message || "Ocurrió un error al guardar el empleado.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit<FormData>(onSubmit)} className="space-y-3">
      <Input label="Nombres" {...register("nombres")} error={errors.nombres?.message} />
      <Input label="Apellidos" {...register("apellidos")} error={errors.apellidos?.message} />

      <div>
  <Input
    label="DPI"
    type="text"
    maxLength={13}
    placeholder="Ingrese 13 dígitos sin espacios ni guiones"
    {...register("dpi", {
      onChange: (e) => {
        // Permitir solo números, eliminar espacios y signos
        e.target.value = e.target.value
          .replace(/\D/g, "") // elimina todo lo que no sea número
          .slice(0, 13); // limita a 13 dígitos
      },
    })}
    error={errors.dpi?.message}
  />
  <p className="text-xs text-gray-500 mt-1">
    Debe ingresar exactamente 13 dígitos numéricos sin espacios ni guiones.
  </p>
</div>

      {/* Género */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
        <select
          {...register("genero")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero.message}</p>}
      </div>

      {/* Estado Civil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
        <select
          {...register("estadoCivil")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un estado civil</option>
          <option value="Soltero">Soltero</option>
          <option value="Casado">Casado</option>
          <option value="Divorciado">Divorciado</option>
          <option value="Viudo">Viudo</option>
          <option value="Unión libre">Unión libre</option>
        </select>
        {errors.estadoCivil && (
          <p className="text-red-500 text-sm mt-1">{errors.estadoCivil.message}</p>
        )}
      </div>

      <Input
        label="Correo electrónico"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input label="Teléfono" {...register("telefono")} error={errors.telefono?.message} />
      <Input label="Dirección" {...register("direccion")} error={errors.direccion?.message} />

      {/* Departamento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
        <select
          {...register("idDepartamento")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un departamento</option>
          {Array.isArray(departamentos) &&
            departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nombre}
              </option>
            ))}
        </select>
        {errors.idDepartamento && (
          <p className="text-red-500 text-sm mt-1">{errors.idDepartamento.message}</p>
        )}
      </div>

      {/* Puesto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
        <select
          {...register("idPuesto")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un puesto</option>
          {Array.isArray(puestos) &&
            puestos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} — Q{p.salarioBase}
              </option>
            ))}
        </select>
        {errors.idPuesto && (
          <p className="text-red-500 text-sm mt-1">{errors.idPuesto.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : empleado ? "Guardar cambios" : "Crear empleado"}
        </Button>
      </div>
    </form>
  );
}
