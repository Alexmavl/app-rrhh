import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { nominaService } from "../../../services/nomina.service";
import { empleadosService } from "../../../services/empleados.service";
import { swalSuccess, swalError } from "../../../utils/swalConfig";
import {
  User,
  Tag,
  DollarSign,
  Type,
  Calendar,
  AlertCircle,
  X,
  Save,
} from "lucide-react";

/* Meses válidos */
const mesesValidos = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/* ✅ Esquema de validación corregido */
const schema = z.object({
  idEmpleado: z
    .string()
    .min(1, "Debe ingresar el ID del empleado")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Debe ingresar un ID válido",
    }),
  
  idConcepto: z
    .string()
    .min(1, "Debe seleccionar un concepto")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Debe seleccionar un concepto válido",
    }),
  
  monto: z
    .string()
    .min(1, "Debe ingresar un monto")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0.01, {
      message: "Debe ingresar un monto válido mayor a 0",
    }),
  
  tipo: z.enum(["BONIFICACION", "DEDUCCION"]),
  
  mes: z.string().min(1, "Debe seleccionar un mes válido").refine(
    (v) => mesesValidos.includes(v),
    { message: "Debe seleccionar un mes válido" }
  ),
  
  anio: z
    .number()
    .min(1900, { message: "El año no puede ser menor a 1900" })
    .max(2100, { message: "El año no puede ser mayor a 2100" }),
});

type FormData = z.infer<typeof schema>;

interface Concepto {
  id: number;
  nombre: string;
  tipo: string;
  montoFijo?: number | null;
  porcentaje?: number | null;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

/** 💰 Modal de registro de bonificaciones o deducciones */
export function BeneficioModal({ onClose, onSuccess }: Props): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      tipo: "BONIFICACION",
      mes: "",
      anio: currentYear,
    },
  });

  const [conceptos, setConceptos] = useState<Concepto[]>([]);
  const [loadingConceptos, setLoadingConceptos] = useState(false);
  const [empleadoNombre, setEmpleadoNombre] = useState<string | null>(null);

  const idEmpleado = watch("idEmpleado");
  const mes = watch("mes");
  const anio = watch("anio");
  const periodo = mes && anio ? `${mes} ${anio}` : "";

  /* 🔍 Buscar empleado */
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

  /* 📜 Cargar conceptos */
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

  /* 💾 Enviar formulario */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const periodo = `${data.mes} ${data.anio}`;
      await nominaService.registrarBeneficio({ ...data, periodo });
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ENCABEZADO */}
      <Card variant="filled">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={18} className="text-white" />
          <h3 className="font-semibold text-white">Registrar Beneficio / Descuento</h3>
        </div>
        <p className="text-white/90 text-sm">
          Asigna una bonificación o deducción a un empleado y especifica el periodo correspondiente
        </p>
      </Card>

      {/* EMPLEADO */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="text-gray-600" />
          <h4 className="font-semibold text-gray-900">Empleado</h4>
        </div>
        <Input
          label="ID del Empleado"
          type="number"
          placeholder="Ej: 12"
          leftIcon={<User size={18} />}
          {...register("idEmpleado")}
          error={errors.idEmpleado?.message}
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
      </Card>

      {/* CONCEPTO */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Tag size={18} className="text-gray-600" />
          <h4 className="font-semibold text-gray-900">Concepto</h4>
        </div>
        <select
          {...register("idConcepto")}
          className="w-full rounded-lg border-2 border-gray-200 pl-3 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
        >
          <option value="">Seleccione un concepto...</option>
          {loadingConceptos ? (
            <option>Cargando...</option>
          ) : (
            conceptos.map((c: Concepto) => (
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
        {errors.idConcepto && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.idConcepto.message}
          </p>
        )}
      </Card>

      {/* MONTO Y TIPO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monto (Q)"
          type="number"
          step="0.01"
          placeholder="Ej: 250.00"
          leftIcon={<DollarSign size={18} />}
          {...register("monto")}
          error={errors.monto?.message}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de beneficio
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Type size={18} />
            </div>
            <select
              {...register("tipo")}
              className="w-full rounded-lg border-2 border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#023778] focus:outline-none transition-all"
            >
              <option value="BONIFICACION">Bonificación</option>
              <option value="DEDUCCION">Descuento</option>
            </select>
          </div>
        </div>
      </div>

      {/* PERIODO */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-gray-600" />
          <h4 className="font-semibold text-gray-900">Periodo</h4>
        </div>

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
                <AlertCircle size={14} /> {errors.mes.message}
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
      </Card>

      {/* RESUMEN */}
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
                Se registrará este beneficio para el periodo indicado.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* BOTONES */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" icon={<X size={18} />} onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" icon={<Save size={18} />} disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}