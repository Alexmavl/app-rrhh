import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { nominaService } from "../../../services/nomina.service";
import { swalSuccess, swalError } from "../../../utils/swalConfig";

/** 🔹 Validación con Zod */
const schema = z.object({
  idEmpleado: z
    .coerce.number()
    .int("Debe ser un número válido")
    .positive("Debe ingresar un ID de empleado"),
  idConcepto: z
    .coerce.number()
    .int("Debe seleccionar un concepto")
    .positive("Debe ingresar un ID de concepto"),
  monto: z.coerce.number().min(0.01, "Debe ingresar un monto válido"),
  tipo: z.enum(["BONIFICACION", "DEDUCCION"]),
  periodo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 💰 Modal de registro de beneficios o deducciones
 */
export function BeneficioModal({ onClose, onSuccess }: Props): React.JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      tipo: "BONIFICACION",
      periodo: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await nominaService.registrarBeneficio(data);
      swalSuccess(
        `✅ ${data.tipo === "BONIFICACION" ? "Bonificación" : "Descuento"} registrado correctamente`
      );
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      swalError(err.response?.data?.message || "❌ Error al registrar beneficio");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm"
    >
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        Registrar Beneficio / Descuento
      </h2>

      <Input
        label="ID Empleado"
        type="number"
        placeholder="Ej: 12"
        {...register("idEmpleado")}
      />
      {errors.idEmpleado && (
        <p className="text-red-600 text-sm">{errors.idEmpleado.message}</p>
      )}

      <Input
        label="ID Concepto"
        type="number"
        placeholder="Ej: 3"
        {...register("idConcepto")}
      />
      {errors.idConcepto && (
        <p className="text-red-600 text-sm">{errors.idConcepto.message}</p>
      )}

      <Input
        label="Monto (Q)"
        type="number"
        step="0.01"
        placeholder="Ej: 250.00"
        {...register("monto")}
      />
      {errors.monto && (
        <p className="text-red-600 text-sm">{errors.monto.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de beneficio
        </label>
        <select
          className="w-full border border-gray-300 rounded-md p-2"
          {...register("tipo")}
        >
          <option value="BONIFICACION">Bonificación</option>
          <option value="DEDUCCION">Descuento</option>
        </select>
        {errors.tipo && (
          <p className="text-red-600 text-sm">{errors.tipo.message}</p>
        )}
      </div>

      <Input
        label="Periodo (opcional)"
        placeholder="Ej: Octubre 2025"
        {...register("periodo")}
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
