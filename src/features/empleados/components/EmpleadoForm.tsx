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
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { swalSuccess, swalError, swalLoading, swalClose } from "../../../utils/swalConfig";
import type { Empleado } from "../../../models/empleado.model";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  IdCard, 
  Building2, 
  Briefcase,
  Save
} from "lucide-react";

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
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Correo electrónico inválido"),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos.")
    .max(15, "El teléfono no puede superar los 15 dígitos.")
    .regex(/^\d+$/, "Solo se permiten números, sin espacios ni letras.")
    .optional(),
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .max(200, "La dirección no puede superar los 200 caracteres.")
    .optional(),
  idDepartamento: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Seleccione un departamento")
  ),
  idPuesto: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Seleccione un puesto")
  ),
  estadoLaboral: z.enum(["Activo", "Inactivo", "Suspendido", "Vacaciones"]).optional(),
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

  const { data: departamentos = [], isLoading: loadingDeps } = useQuery({
    queryKey: ["departamentos"],
    queryFn: departamentosService.listar,
  });

  const { data: puestos = [], isLoading: loadingPuestos } = useQuery({
    queryKey: ["puestos"],
    queryFn: puestosService.listar,
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      swalLoading(empleado ? "Actualizando empleado..." : "Creando empleado...");
      
      if (empleado) {
        await empleadosService.editar(empleado.id, data);
        swalClose();
        await swalSuccess(
          "Empleado actualizado",
          "Los datos del empleado se modificaron correctamente."
        );
      } else {
        await empleadosService.crear({
          ...data,
          estadoLaboral: "Activo",
        });
        swalClose();
        await swalSuccess(
          "Empleado creado",
          "El nuevo empleado fue registrado con éxito."
        );
      }
      onSuccess();
    } catch (err: any) {
      swalClose();
      await swalError(
        "Error",
        err.response?.data?.message || "Ocurrió un error al guardar el empleado."
      );
    }
  };

  if (loadingDeps || loadingPuestos) {
    return <LoadingSpinner text="Cargando formulario..." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Información Personal */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
          Información Personal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombres"
            placeholder="Ej: Juan Carlos"
            leftIcon={<User size={18} />}
            {...register("nombres")}
            error={errors.nombres?.message}
            required
          />

          <Input
            label="Apellidos"
            placeholder="Ej: García López"
            leftIcon={<User size={18} />}
            {...register("apellidos")}
            error={errors.apellidos?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="DPI"
              type="text"
              maxLength={13}
              placeholder="1234567890123"
              leftIcon={<IdCard size={18} />}
              {...register("dpi", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 13);
                },
              })}
              error={errors.dpi?.message}
              helperText="13 dígitos numéricos sin espacios"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Género <span className="text-red-500">*</span>
            </label>
            <select
              {...register("genero")}
              className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
            >
              <option value="">Seleccione un género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errors.genero && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.genero.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado Civil <span className="text-red-500">*</span>
          </label>
          <select
            {...register("estadoCivil")}
            className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
          >
            <option value="">Seleccione un estado civil</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viudo">Viudo</option>
            <option value="Unión libre">Unión libre</option>
          </select>
          {errors.estadoCivil && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {errors.estadoCivil.message}
            </p>
          )}
        </div>
      </div>

      {/* Contacto */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
          Información de Contacto
        </h3>

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@empresa.com"
          leftIcon={<Mail size={18} />}
          {...register("email")}
          error={errors.email?.message}
          required
        />

        <Input
          label="Teléfono"
          type="text"
          maxLength={15}
          placeholder="12345678"
          leftIcon={<Phone size={18} />}
          {...register("telefono", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 15);
            },
          })}
          error={errors.telefono?.message}
          helperText="Mínimo 7 dígitos, solo números"
        />

        <Input
          label="Dirección"
          placeholder="Ej: 5ta Avenida 10-20, Zona 1"
          leftIcon={<MapPin size={18} />}
          {...register("direccion")}
          error={errors.direccion?.message}
          helperText="Dirección completa de residencia"
        />
      </div>

      {/* Información Laboral */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
          Información Laboral
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Departamento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Building2 size={18} />
              </div>
              <select
                {...register("idDepartamento")}
                className="w-full rounded-lg border-2 border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
              >
                <option value="">Seleccione un departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nombre}
                  </option>
                ))}
              </select>
            </div>
            {errors.idDepartamento && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.idDepartamento.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Puesto <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Briefcase size={18} />
              </div>
              <select
                {...register("idPuesto")}
                className="w-full rounded-lg border-2 border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
              >
                <option value="">Seleccione un puesto</option>
                {puestos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — Q{p.salarioBase.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            {errors.idPuesto && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {errors.idPuesto.message}
              </p>
            )}
          </div>
        </div>

        {/* Estado Laboral - solo visible al editar */}
        {empleado && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado Laboral
            </label>
            <select
              {...register("estadoLaboral")}
              defaultValue={empleado.estadoLaboral || "Activo"}
              className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Vacaciones">Vacaciones</option>
            </select>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          icon={<Save size={18} />}
        >
          {empleado ? "Guardar cambios" : "Crear empleado"}
        </Button>
      </div>
    </form>
  );
}