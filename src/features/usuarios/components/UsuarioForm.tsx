import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Rol } from "../models/usuario.model";

const usuarioSchema = z.object({
  idRol: z.number().min(1, "Seleccione un rol"),
  nombre: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  password: z.string().optional(),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface Props {
  onSubmit: (data: UsuarioFormData) => void;
  roles: Rol[];
  initialData?: Partial<UsuarioFormData>;
  isEdit?: boolean;
}

export function UsuarioForm({ onSubmit, roles, initialData, isEdit }: Props) {
  const { register, handleSubmit, formState, reset } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

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

      {/* Contraseña (solo al crear) */}
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
