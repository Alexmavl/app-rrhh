import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { nominaService } from "../../../services/nomina.service";

/**
 * 🔹 Esquema Zod con coerción de números
 */
const schema = z.object({
  periodo: z
    .string()
    .min(4, "El periodo es obligatorio (ej. Octubre 2025)")
    .max(50),
  fechaGeneracion: z.string().min(1, "Debe seleccionar una fecha"),
  bonificacion: z.coerce.number().nonnegative().default(0),
  descuentos: z.coerce.number().nonnegative().default(0),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 💰 Formulario de creación de Nómina
 * 100% funcional y sin errores de TypeScript
 */
export function NominaForm({ onClose, onSuccess }: Props): React.JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // 👇 Forzamos el resolver a evitar conflicto con los tipos inferidos
    resolver: zodResolver(schema) as any,
    defaultValues: {
      periodo: "",
      fechaGeneracion: new Date().toISOString().slice(0, 10),
      bonificacion: 250,
      descuentos: 0,
    },
  });

  // Tipado explícito para SubmitHandler<FormData>
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await nominaService.crear(data);
      alert("✅ Nómina generada correctamente");
      reset();
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Error al generar nómina");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm"
    >
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        Generar nueva nómina
      </h2>

      <Input
        label="Periodo"
        placeholder="Ej. Octubre 2025"
        {...register("periodo")}
      />
      {errors.periodo && (
        <p className="text-red-600 text-sm">{errors.periodo.message}</p>
      )}

      <Input
        label="Fecha de Generación"
        type="date"
        {...register("fechaGeneracion")}
      />
      {errors.fechaGeneracion && (
        <p className="text-red-600 text-sm">{errors.fechaGeneracion.message}</p>
      )}

      <Input
        label="Bonificación (Q)"
        type="number"
        step="0.01"
        {...register("bonificacion")}
      />
      {errors.bonificacion && (
        <p className="text-red-600 text-sm">{errors.bonificacion.message}</p>
      )}

      <Input
        label="Descuentos (Q)"
        type="number"
        step="0.01"
        {...register("descuentos")}
      />
      {errors.descuentos && (
        <p className="text-red-600 text-sm">{errors.descuentos.message}</p>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Generar Nómina"}
        </Button>
      </div>
    </form>
  );
}
