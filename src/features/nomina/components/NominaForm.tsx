import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { nominaService } from "../../../services/nomina.service";
import { 
  swalSuccess, 
  swalError, 
  swalConfirm, 
  swalLoading, 
  swalClose 
} from "../../../utils/swalConfig";
import { 
  Calendar, 
  Users, 
  User, 
  Save,
  X,
  AlertCircle,
} from "lucide-react";

/* Meses válidos */
const mesesValidos = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/* Esquema de validación */
const schema = z
  .object({
    mes: z.string().refine((v) => mesesValidos.includes(v), {
      message: "Debe seleccionar un mes válido",
    }),
    anio: z
      .number()
      .min(1900, { message: "El año no puede ser menor a 1900" })
      .max(2100, { message: "El año no puede ser mayor a 2100" }),
    fechaInicio: z.string().min(1, { message: "Debe indicar la fecha de inicio" }),
    fechaFin: z.string().min(1, { message: "Debe indicar la fecha de fin" }),
    idEmpleado: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v ? Number(v) : undefined)),
  })
  .superRefine((data, ctx) => {
    const mesIndex = mesesValidos.indexOf(data.mes) + 1;
    const inicio = new Date(`${data.fechaInicio}T00:00:00`);
    const fin = new Date(`${data.fechaFin}T00:00:00`);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["fechaInicio"],
        message: "Las fechas deben ser válidas",
      });
      return;
    }

    if (fin < inicio) {
      ctx.addIssue({
        code: "custom",
        path: ["fechaFin"],
        message: "La fecha fin no puede ser anterior a la fecha inicio",
      });
    }

    if (inicio.getFullYear() !== data.anio || fin.getFullYear() !== data.anio) {
      ctx.addIssue({
        code: "custom",
        path: ["fechaInicio"],
        message: `Las fechas deben pertenecer al año ${data.anio}`,
      });
    }

    if (inicio.getMonth() + 1 !== mesIndex || fin.getMonth() + 1 !== mesIndex) {
      ctx.addIssue({
        code: "custom",
        path: ["fechaInicio"],
        message: `Las fechas deben corresponder al mes de ${data.mes}`,
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function NominaForm({ onClose, onSuccess }: Props): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
const [isBuscando, setIsBuscando] = useState(false);

  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      mes: "",
      anio: currentYear,
      fechaInicio: "",
      fechaFin: "",
      idEmpleado: undefined,
    },
  });

  const mes = watch("mes");
  const anio = watch("anio");
  const idEmpleado = watch("idEmpleado");
  const periodo = mes && anio ? `${mes} ${anio}` : "";

  /* Autocompletar fechas */
  useEffect(() => {
    if (!mes || !anio) return;

    const mesIndex = mesesValidos.indexOf(mes);
    if (mesIndex === -1) return;

    const inicio = new Date(anio, mesIndex, 1);
    const fin = new Date(anio, mesIndex + 1, 0);

    const fmt = (d: Date) => d.toISOString().split("T")[0];

    setValue("fechaInicio", fmt(inicio));
    setValue("fechaFin", fmt(fin));
  }, [mes, anio, setValue]);

  /* Envío del formulario */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const periodo = `${data.mes} ${data.anio}`;
    
    try {
      if (data.idEmpleado) {
        const confirm = await swalConfirm(
          "¿Generar nómina individual?",
          `Se generará la nómina solo para el empleado ID ${data.idEmpleado} del periodo ${periodo}`,
          "Sí, generar",
          "Cancelar"
        );
        if (!confirm.isConfirmed) return;

        setIsLoading(true);
        swalLoading("Generando nómina individual...");

        await nominaService.crear({
          idEmpleado: data.idEmpleado,
          periodo,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
        });

        swalClose();
        await swalSuccess(
          "Nómina individual creada",
          "La nómina se generó correctamente"
        );
      } else {
        const confirm = await swalConfirm(
          "¿Procesar nómina general?",
          `Se procesará la nómina para todos los empleados del periodo ${periodo}`,
          "Sí, procesar",
          "Cancelar"
        );
        if (!confirm.isConfirmed) return;

        setIsLoading(true);
        swalLoading("Procesando nómina general...", "Esto puede tomar unos momentos");

        await nominaService.procesar({
          periodo,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
        });

        swalClose();
        await swalSuccess(
          "Nómina general procesada",
          "La nómina se generó correctamente para todos los empleados"
        );
      }

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      swalClose();
      await swalError(
        "Error al generar nómina",
        err.response?.data?.message || "No se pudo procesar la nómina. Intenta nuevamente."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const buscarEmpleados = async (query: string) => {
  if (!query.trim()) {
    setSugerencias([]);
    return;
  }

  try {
    setIsBuscando(true);
    const data = await nominaService.buscarEmpleados(query); 
    // 🔹 Debe devolver [{ idEmpleado, nombre }]
    setSugerencias(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error buscando empleados", err);
  } finally {
    setIsBuscando(false);
  }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Información del periodo */}
      <Card variant="filled">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={18} className="text-white" />
          <h3 className="font-semibold text-white">Periodo de Nómina</h3>
        </div>
        <p className="text-white/90 text-sm">
          Selecciona el mes y año para el cual deseas generar la nómina
        </p>
      </Card>

      {/* Selección de mes y año */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mes <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Calendar size={18} />
            </div>
            <select
              className="w-full rounded-lg border-2 border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
              {...register("mes")}
            >
              <option value="">Seleccione un mes...</option>
              {mesesValidos.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          {errors.mes && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.mes.message}
            </p>
          )}
        </div>

        <Input
          label="Año"
          type="number"
          placeholder="Ej: 2025"
          leftIcon={<Calendar size={18} />}
          {...register("anio", { valueAsNumber: true })}
          error={errors.anio?.message}
          required
        />
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fecha Inicio"
          type="date"
          leftIcon={<Calendar size={18} />}
          {...register("fechaInicio")}
          error={errors.fechaInicio?.message}
          helperText="Primer día del periodo"
          required
        />

        <Input
          label="Fecha Fin"
          type="date"
          leftIcon={<Calendar size={18} />}
          {...register("fechaFin")}
          error={errors.fechaFin?.message}
          helperText="Último día del periodo"
          required
        />
      </div>

      {/* ID Empleado opcional */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="text-gray-600" />
          <h4 className="font-semibold text-gray-900">Nómina Individual (Opcional)</h4>
        </div>
        <Input
          label="ID del Empleado"
          type="number"
          placeholder="Dejar vacío para procesar todos los empleados"
          leftIcon={<User size={18} />}
          {...register("idEmpleado")}
          helperText="Si especificas un ID, solo se generará la nómina para ese empleado"
        />
      </Card>

      {/* Resumen del periodo */}
      {periodo && (
        <Card variant="outlined">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Periodo seleccionado
              </p>
              <p className="text-lg font-bold" style={{ color: "#023778" }}>
                {periodo}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {idEmpleado 
                  ? `Nómina individual para empleado ID ${idEmpleado}` 
                  : "Nómina general para todos los empleados"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          icon={<X size={18} />}
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          icon={idEmpleado ? <User size={18} /> : <Users size={18} />}
        >
          {isLoading 
            ? "Procesando..." 
            : idEmpleado 
            ? "Generar Individual" 
            : "Procesar General"}
        </Button>
      </div>
    </form>
  );
}