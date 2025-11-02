import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Rol } from "../models/usuario.model";
import { empleadosService } from "../../../services/empleados.service";
import { AlertCircle } from "lucide-react";

/* Esquema de validación */
const usuarioSchema = z.object({
  idRol: z.number().min(1, "Seleccione un rol"),
  nombre: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  password: z.string().optional(),
  idEmpleado: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : null))
    .refine((val) => val === null || val > 0, {
      message: "Debe ingresar un ID válido",
    }),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface Props {
  onSubmit: (data: UsuarioFormData) => void;
  roles: Rol[];
  initialData?: Partial<UsuarioFormData>;
  isEdit?: boolean;
}

export function UsuarioForm({ onSubmit, roles, initialData, isEdit }: Props) {
  const { register, handleSubmit, control, formState, reset } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: initialData || {},
  });

  const selectedRol = useWatch({ control, name: "idRol" });
  const idEmpleado = useWatch({ control, name: "idEmpleado" });
  const [empleadoNombre, setEmpleadoNombre] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  /* 🔍 Buscar empleado automáticamente */
  useEffect(() => {
    const buscarEmpleado = async () => {
      if (!idEmpleado) {
        setEmpleadoNombre(null);
        return;
      }
      try {
        const empleado = await empleadosService.obtenerPorId(Number(idEmpleado));
        if (empleado?.nombres) {
          setEmpleadoNombre(`${empleado.nombres} ${empleado.apellidos}`);
        } else {
          setEmpleadoNombre("No encontrado");
        }
      } catch {
        setEmpleadoNombre("No encontrado");
      }
    };
    buscarEmpleado();
  }, [idEmpleado]);

  /* 🧩 Determinar si el rol seleccionado es Empleado */
  const esRolEmpleado = roles.find((r) => r.id === selectedRol)?.nombre.toLowerCase() === "empleado";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold mb-1">Nombre</label>
        <input
          {...register("nombre")}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Nombre completo"
        />
        {formState.errors.nombre && (
          <p className="text-red-600 text-sm">{formState.errors.nombre.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
        <input
          {...register("email")}
          type="email"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="usuario@empresa.com"
        />
        {formState.errors.email && (
          <p className="text-red-600 text-sm">{formState.errors.email.message}</p>
        )}
      </div>

      {/* Rol */}
      <div>
        <label className="block text-sm font-semibold mb-1">Rol</label>
        <select
          {...register("idRol", { valueAsNumber: true })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Seleccione un rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
        {formState.errors.idRol && (
          <p className="text-red-600 text-sm">{formState.errors.idRol.message}</p>
        )}
      </div>

      {/* 👷 Campo ID del Empleado solo si el rol es Empleado */}
      {esRolEmpleado && (
        <div>
          <label className="block text-sm font-semibold mb-1">
            ID del Empleado <span className="text-red-500">*</span>
          </label>
          <input
            {...register("idEmpleado")}
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Ingrese el ID del empleado"
          />
          {empleadoNombre && (
            <p
              className={`mt-1 text-sm ${
                empleadoNombre === "No encontrado"
                  ? "text-red-600"
                  : "text-green-700 font-semibold"
              }`}
            >
              {empleadoNombre}
            </p>
          )}
          {formState.errors.idEmpleado && (
            <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {formState.errors.idEmpleado.message}
            </p>
          )}
        </div>
      )}

      {/* Contraseña */}
      {!isEdit && (
        <div>
          <label className="block text-sm font-semibold mb-1">Contraseña</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contraseña temporal"
          />
          {formState.errors.password && (
            <p className="text-red-600 text-sm">{formState.errors.password.message}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium"
      >
        {isEdit ? "Guardar cambios" : "Crear usuario"}
      </button>
    </form>
  );
}
