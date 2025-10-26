import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { nominaService } from "../../../services/nomina.service";
import { VoucherEmpleado } from "../components/VoucherEmpleado";
import { swalError } from "../../../utils/swalConfig";

/**
 * 📊 Vista detallada de una nómina
 * Muestra empleados procesados y permite ver su voucher con el detalle completo.
 */
export function NominaDetallePage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nomina, setNomina] = useState<any[]>([]);
  const [voucher, setVoucher] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** 🔹 Cargar detalle de nómina */
  const fetchNominaDetalle = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await nominaService.obtenerPorId(Number(id));
      if (!data || data.length === 0) {
        swalError("No se encontró información de esta nómina");
        navigate("/nomina");
        return;
      }
      setNomina(data);
    } catch (err) {
      console.error(err);
      swalError("Error al obtener detalle de la nómina");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominaDetalle();
  }, [id]);

  /** 🔹 Generar voucher con detalle por empleado */
  const handleVoucher = async (row: any) => {
    try {
      const res = await nominaService.obtenerVoucher(row.idEmpleado, row.periodo);
      if (!res || res.length === 0) {
        swalError("No se encontró voucher para este empleado");
        return;
      }
      setVoucher(res[0]);
    } catch (err) {
      console.error(err);
      swalError("Error al generar voucher del empleado");
    }
  };

  /** 🔹 Volver atrás */
  const handleBack = () => navigate("/nomina");

  /** 🔹 Formatear fecha */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-GT", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  /** 🔹 Columnas principales (sin IGSS ni IRTRA) */
  const columns = [
    { key: "empleado", label: "Empleado" },
    { key: "departamento", label: "Departamento" },
    { key: "puesto", label: "Puesto" },
    {
      key: "salarioBase",
      label: "Salario Base",
      align: "right" as const,
      render: (v: any) => `Q${Number(v || 0).toFixed(2)}`,
    },
    {
      key: "totalBonificaciones",
      label: "Bonificaciones",
      align: "right" as const,
      render: (v: any) => `Q${Number(v || 0).toFixed(2)}`,
    },
    {
      key: "totalDescuentos",
      label: "Descuentos",
      align: "right" as const,
      render: (v: any) => (
        <span className="text-red-600">-Q{Number(v || 0).toFixed(2)}</span>
      ),
    },
    {
      key: "totalLiquido",
      label: "Total Líquido",
      align: "right" as const,
      render: (v: any) => (
        <span className="font-semibold text-green-700">
          Q{Number(v || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      align: "center" as const,
      render: (_: any, row: any) => (
        <Button size="sm" onClick={() => handleVoucher(row)}>
          📄 Voucher
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  const cabecera = nomina[0];

  return (
    <div className="p-6 space-y-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Nómina #{cabecera?.id} - {cabecera?.periodo}
          </h1>
          <p className="text-gray-500 text-sm">
            {formatDate(cabecera?.fechaInicio)} → {formatDate(cabecera?.fechaFin)} |{" "}
            Procesada: {formatDate(cabecera?.fechaProcesada)}
          </p>
        </div>

        <Button variant="secondary" onClick={handleBack}>
          ← Volver
        </Button>
      </div>

      {/* Tabla principal */}
      <Card>
        <Table
          data={nomina}
          columns={columns}
          emptyMessage="No hay empleados en esta nómina"
        />
      </Card>

      {/* Totales generales */}
      <div className="text-right font-semibold text-lg text-gray-800 mt-4 space-y-1">
        <div>
          Total Bonificaciones:{" "}
          <span className="text-blue-700">
            Q
            {nomina
              .reduce((sum, n) => sum + (Number(n.totalBonificaciones) || 0), 0)
              .toFixed(2)}
          </span>
        </div>
        <div>
          Total Descuentos:{" "}
          <span className="text-red-600">
            -Q
            {nomina
              .reduce((sum, n) => sum + (Number(n.totalDescuentos) || 0), 0)
              .toFixed(2)}
          </span>
        </div>
        <div>
          Total Nómina:{" "}
          <span className="text-green-700">
            Q
            {nomina
              .reduce((sum, n) => sum + (Number(n.totalLiquido) || 0), 0)
              .toFixed(2)}
          </span>
        </div>
      </div>

      {/* Modal con detalle completo del empleado */}
      {voucher && (
        <Modal
          show={true}
          title={`Voucher de ${voucher.empleado}`}
          onClose={() => setVoucher(null)}
        >
          {/* 🔹 Aquí mostramos el componente VoucherEmpleado que ya incluye el detalle */}
          <VoucherEmpleado voucher={voucher} />
        </Modal>
      )}
    </div>
  );
}

export default NominaDetallePage;
