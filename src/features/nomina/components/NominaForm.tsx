import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { nominaService } from "../../../services/nomina.service";
import {
  swalSuccess,
  swalError,
  swalConfirm,
  swalCustom,
} from "../../../utils/swalConfig";

/**
 * 🔹 Esquema Zod validado
 */
const schema = z.object({
  periodo: z
    .string()
    .min(4, "El periodo es obligatorio (Ej. Octubre 2025)")
    .max(50),
  fechaInicio: z.string().min(1, "Debe indicar fecha de inicio"),
  fechaFin: z.string().min(1, "Debe indicar fecha de fin"),
  idEmpleado: z
    .union([z.string().min(1, "ID requerido"), z.literal("")])
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 💼 Formulario de generación de nómina
 * Compatible con creación general o individual.
 */
export function NominaForm({ onClose, onSuccess }: Props): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      periodo: "",
      fechaInicio: "",
      fechaFin: "",
      idEmpleado: undefined,
    },
  });

  /**
   * 🧮 Procesar o crear nómina
   */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);

      // Si el usuario indica un empleado, genera nómina individual
      if (data.idEmpleado) {
        const confirm = await swalConfirm(
          `¿Deseas generar la nómina solo para el empleado ID ${data.idEmpleado}?`
        );
        if (!confirm.isConfirmed) return;

        await nominaService.crear({
          idEmpleado: data.idEmpleado,
          periodo: data.periodo,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
        });

        swalSuccess("✅ Nómina individual creada correctamente");
      } else {
        const confirm = await swalConfirm(
          `¿Deseas procesar la nómina general del periodo ${data.periodo}?`
        );
        if (!confirm.isConfirmed) return;

        await nominaService.procesar({
          periodo: data.periodo,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
        });

        swalSuccess("🧾 Nómina general procesada correctamente");
      }

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      swalError(err.response?.data?.message || "❌ Error al generar la nómina");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🧾 Generar voucher por empleado
   */
  const handleGenerarVoucher = async () => {
    const { value: idEmpleadoInput } = await swalCustom({
      title: "Generar voucher por empleado",
      input: "text",
      inputPlaceholder: "ID del empleado",
      confirmButtonText: "Generar Voucher",
      showCancelButton: true,
      icon: "question",
    });

    if (!idEmpleadoInput) return;

    try {
      const periodo = (
        document.querySelector('input[name="periodo"]') as HTMLInputElement
      )?.value;

      if (!periodo) {
        swalError("Primero especifica un periodo válido");
        return;
      }

      const res = await nominaService.obtenerVoucher(
        Number(idEmpleadoInput),
        periodo
      );

      if (!res || res.length === 0) {
        swalError("No se encontró información de nómina para este empleado");
        return;
      }

      const voucher = res[0];
      swalSuccess(
        `Voucher generado correctamente para ${voucher.empleado} - Total: Q${voucher.totalLiquido}`
      );
    } catch (err: any) {
      swalError("Error al generar voucher");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm"
    >
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        Generar Nómina
      </h2>

      <Input
        label="Periodo"
        placeholder="Ej. Octubre 2025"
        {...register("periodo")}
      />
      {errors.periodo && (
        <p className="text-red-600 text-sm">{errors.periodo.message}</p>
      )}

      <Input label="Fecha Inicio" type="date" {...register("fechaInicio")} />
      {errors.fechaInicio && (
        <p className="text-red-600 text-sm">{errors.fechaInicio.message}</p>
      )}

      <Input label="Fecha Fin" type="date" {...register("fechaFin")} />
      {errors.fechaFin && (
        <p className="text-red-600 text-sm">{errors.fechaFin.message}</p>
      )}

      <Input
        label="ID Empleado (opcional)"
        placeholder="Dejar vacío para procesar general"
        type="number"
        {...register("idEmpleado")}
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        {/* ✅ Botón para generar voucher */}
        <Button
          type="button"
          variant="ghost" // Cambiado de outline → ghost para evitar error TS
          onClick={handleGenerarVoucher}
          disabled={isLoading}
        >
          Voucher Empleado
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Generar"}
        </Button>
      </div>
    </form>
  );
}
