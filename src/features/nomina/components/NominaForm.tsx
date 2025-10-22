// src/features/nomina/components/NominaForm.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { nominaService } from "../../../services/nomina.service";

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

export function NominaForm({ onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      periodo: "",
      fechaGeneracion: new Date().toISOString().slice(0, 10),
      bonificacion: 250,
      descuentos: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await nominaService.crear(data);
      alert("✅ Nómina generada correctamente");
      reset();
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al generar nómina");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input label="Periodo" placeholder="Ej. Octubre 2025" {...register("periodo")} />
      {errors.periodo && <p className="text-red-600 text-sm">{errors.periodo.message}</p>}

      <Input label="Fecha de Generación" type="date" {...register("fechaGeneracion")} />
      {errors.fechaGeneracion && (
        <p className="text-red-600 text-sm">{errors.fechaGeneracion.message}</p>
      )}

      <Input
        label="Bonificación (Q)"
        type="number"
        step="0.01"
        {...register("bonificacion")}
      />
      <Input
        label="Descuentos (Q)"
        type="number"
        step="0.01"
        {...register("descuentos")}
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Generar Nómina
        </Button>
      </div>
    </form>
  );
}
