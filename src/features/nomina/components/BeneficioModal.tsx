import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { nominaService } from "../../../services/nomina.service";
import { empleadosService } from "../../../services/empleados.service";
import { swalSuccess, swalError } from "../../../utils/swalConfig";
import { User, Tag, DollarSign, Type } from "lucide-react";

/** ✅ Validación con Zod */
const schema = z.object({
  idEmpleado: z.coerce.number().positive("Debe ingresar un ID válido"),
  idConcepto: z.coerce.number().positive("Debe seleccionar un concepto"),
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
 * 💰 Formulario para registrar beneficios o deducciones
 */
export function BeneficioModal({ onClose, onSuccess }: Props): React.JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: "BONIFICACION" },
  });

  const [conceptos, setConceptos] = useState<
    { id: number; nombre: string; tipo: string; montoFijo?: number | null; porcentaje?: number | null }[]
  >([]);
  const [loadingConceptos, setLoadingConceptos] = useState(false);
  const [empleadoNombre, setEmpleadoNombre] = useState<string | null>(null);
  const idEmpleado = watch("idEmpleado");

  /** 🔹 Buscar empleado por ID */
  const handleBuscarEmpleado = async (id: number) => {
    if (!id || id <= 0) {
      setEmpleadoNombre(null);
      return;
    }
    try {
      const empleado = await empleadosService.obtenerPorId(id);
      if (empleado?.nombres) {
        setEmpleadoNombre(`${empleado.nombres} ${empleado.apellidos}`);
      } else {
        setEmpleadoNombre("No encontrado");
      }
    } catch {
      setEmpleadoNombre("No encontrado");
    }
  };

  useEffect(() => {
    if (idEmpleado && !isNaN(Number(idEmpleado))) {
      handleBuscarEmpleado(Number(idEmpleado));
    } else {
      setEmpleadoNombre(null);
    }
  }, [idEmpleado]);

  /** 🔹 Cargar conceptos desde el backend */
  useEffect(() => {
    const cargarConceptos = async () => {
      try {
        setLoadingConceptos(true);
        const data = await nominaService.listarConceptos();
        setConceptos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al obtener conceptos:", err);
      } finally {
        setLoadingConceptos(false);
      }
    };
    cargarConceptos();
  }, []);

  /** 🔹 Enviar formulario */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await nominaService.registrarBeneficio(data);
      await swalSuccess(
        `✅ ${data.tipo === "BONIFICACION" ? "Bonificación" : "Descuento"} registrado correctamente`
      );
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      swalError(err.response?.data?.message || "❌ Error al registrar beneficio");
    }
  };

  /** 🧩 Vista del formulario */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        Registrar Beneficio / Descuento
      </h2>

      {/* 🔹 Empleado por ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID del Empleado
        </label>
        <div className="flex items-center gap-2">
          <User size={18} className="text-gray-400" />
          <input
            type="number"
            placeholder="Ej: 12"
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            {...register("idEmpleado", { valueAsNumber: true })}
          />
        </div>
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
        {errors.idEmpleado && (
          <p className="text-red-600 text-sm mt-1">
            {errors.idEmpleado.message}
          </p>
        )}
      </div>

      {/* 🔹 Concepto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Concepto
        </label>
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-gray-400" />
          <select
            {...register("idConcepto", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">Seleccione un concepto...</option>
            {loadingConceptos ? (
              <option>Cargando...</option>
            ) : (
              conceptos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.tipo}){" "}
                  {c.montoFijo
                    ? `(Q${Number(c.montoFijo).toFixed(2)})`
                    : c.porcentaje
                    ? `(${c.porcentaje}%)`
                    : ""}
                </option>
              ))
            )}
          </select>
        </div>
        {errors.idConcepto && (
          <p className="text-red-600 text-sm mt-1">
            {errors.idConcepto.message}
          </p>
        )}
      </div>

      {/* 🔹 Monto */}
      <Input
        label="Monto (Q)"
        type="number"
        step="0.01"
        placeholder="Ej: 250.00"
        leftIcon={<DollarSign size={18} />}
        {...register("monto", { valueAsNumber: true })}
        error={errors.monto?.message}
      />

      {/* 🔹 Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de beneficio
        </label>
        <div className="flex items-center gap-2">
          <Type size={18} className="text-gray-400" />
          <select
            {...register("tipo")}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="BONIFICACION">Bonificación</option>
            <option value="DEDUCCION">Descuento</option>
          </select>
        </div>
      </div>

      {/* 🔹 Periodo */}
      <Input
        label="Periodo (opcional)"
        placeholder="Ej: Octubre 2025"
        {...register("periodo")}
      />

      {/* 🔹 Botones */}
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
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
