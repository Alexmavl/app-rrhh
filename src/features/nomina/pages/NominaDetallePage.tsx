import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { nominaService } from "../../../services/nomina.service";
import { VoucherEmpleado } from "../components/VoucherEmpleado";
import { swalError } from "../../../utils/swalConfig";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

/* Utilidad para formato contable */
const formatQ = (num: number | null | undefined) =>
  `Q${Number(num || 0).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function NominaDetallePage(): React.JSX.Element {
  const { periodo } = useParams<{ periodo: string }>();
  const navigate = useNavigate();

  const [nomina, setNomina] = useState<any[]>([]);
  const [voucher, setVoucher] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** 🔹 Cargar detalle de nómina */
  const fetchNominaDetalle = async () => {
    if (!periodo) return;
    try {
      setIsLoading(true);
      const data = await nominaService.obtenerDetallePorPeriodo(periodo);
      setNomina(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      await swalError("Error", "No se pudo obtener el detalle de la nómina");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominaDetalle();
  }, [periodo]);

  /** 🔹 Totales de nómina */
  const totales = useMemo(() => {
    const sum = (key: string) =>
      nomina.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
    return {
      salarioBase: sum("salarioBase"),
      bonificacion: sum("Bonificacion"),
      incentivo: sum("Incentivo"),
      igss: sum("IGSS"),
      irtra: sum("IRTRA"),
      bonosExtras: sum("Bonos extras"),
      otrosDescuentos: sum("Otros Descuentos"),
      beneficiosEmpleado: sum("Beneficios Empleado"),
      descuentosEmpleado: sum("Descuentos Empleado"),
      totalLiquido: sum("Total Liquido"),
    };
  }, [nomina]);

  /** 🔹 Mostrar voucher */
  const handleVoucher = async (row: any) => {
    try {
      const res = await nominaService.obtenerVoucher(row.idEmpleado, periodo!);
      if (res && res.length > 0) {
        setVoucher(res[0]);
      } else {
        await swalError("Error", "No se encontró voucher para este empleado");
      }
    } catch (err) {
      console.error(err);
      await swalError("Error", "No se pudo generar el voucher");
    }
  };

  const handleCloseVoucher = () => setVoucher(null);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando detalle de nómina..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#023778" }}>
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle de Nómina
              </h1>
              <p className="text-sm text-gray-600">
                Periodo: {decodeURIComponent(periodo || "")}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate("/nomina")}
          >
            Volver
          </Button>
        </div>
      </Card>

      {/* Tarjetas de resumen */}
      {nomina.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Empleados</p>
                <p className="text-2xl font-bold text-gray-900">{nomina.length}</p>
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatQ(totales.totalLiquido)}
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio por Empleado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatQ(totales.totalLiquido / nomina.length)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabla de detalle */}
      <Card padding="none">
        {nomina.length > 0 ? (
          <div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-300 text-sm">
  <thead style={{ backgroundColor: "#023778" }} className="text-white">
    <tr>
      <th className="px-3 py-3 text-left">#</th>
      <th className="px-3 py-3 text-left">Empleado</th>
      <th className="px-3 py-3 text-left">Puesto</th>
      <th className="px-3 py-3 text-left">Departamento</th>
      <th className="px-3 py-3 text-right">Salario Base</th>
      <th className="px-3 py-3 text-right">Bonificación</th>
      <th className="px-3 py-3 text-right">Incentivo</th>
      <th className="px-3 py-3 text-right">IGSS</th>
      <th className="px-3 py-3 text-right">IRTRA</th>
      <th className="px-3 py-3 text-right">Bonos Extras</th>
      <th className="px-3 py-3 text-right">Otros Desc.</th>
      <th className="px-3 py-3 text-right">Total Líquido</th>
      <th className="px-3 py-3 text-center">Acciones</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-200 bg-white">
    {nomina.map((row, i) => (
      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
        <td className="px-3 py-3">{i + 1}</td>
        <td className="px-3 py-3 font-medium">{row.empleado}</td>
        <td className="px-3 py-3">{row.puesto}</td>
        <td className="px-3 py-3">{row.departamento}</td>
        <td className="px-3 py-3 text-right">{formatQ(row.salarioBase)}</td>
        <td className="px-3 py-3 text-right">{formatQ(row.Bonificacion)}</td>
        <td className="px-3 py-3 text-right">{formatQ(row.Incentivo)}</td>
        <td className="px-3 py-3 text-right text-red-600">-{formatQ(row.IGSS)}</td>
        <td className="px-3 py-3 text-right text-red-600">-{formatQ(row.IRTRA)}</td>
        <td className="px-3 py-3 text-right text-green-600">
          {formatQ(row["Bonos extras"])}
        </td>
        <td className="px-3 py-3 text-right text-red-600">
          -{formatQ(row["Otros Descuentos"])}
        </td>
        <td className="px-3 py-3 text-right font-bold text-green-700">
          {formatQ(row["Total Liquido"])}
        </td>
        <td className="px-3 py-3 text-center">
          <Button size="sm" variant="info" onClick={() => handleVoucher(row)}>
            <FileText size={14} /> Voucher
          </Button>
        </td>
      </tr>
    ))}
  </tbody>

  <tfoot className="bg-blue-50 font-bold border-t-2" style={{ borderColor: "#023778" }}>
    <tr>
      <td colSpan={4} className="text-right px-3 py-4">TOTALES:</td>
      <td className="text-right px-3 py-4">{formatQ(totales.salarioBase)}</td>
      <td className="text-right px-3 py-4">{formatQ(totales.bonificacion)}</td>
      <td className="text-right px-3 py-4">{formatQ(totales.incentivo)}</td>
      <td className="text-right px-3 py-4 text-red-600">-{formatQ(totales.igss)}</td>
      <td className="text-right px-3 py-4 text-red-600">-{formatQ(totales.irtra)}</td>
      <td className="text-right px-3 py-4 text-green-600">{formatQ(totales.bonosExtras)}</td>
      <td className="text-right px-3 py-4 text-red-600">-{formatQ(totales.otrosDescuentos)}</td>
      <td className="text-right px-3 py-4 text-green-700 text-lg">{formatQ(totales.totalLiquido)}</td>
      <td></td>
    </tr>
  </tfoot>
</table>

          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <FileText size={48} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                No hay registros en esta nómina
              </h3>
              <p className="text-sm text-gray-500">
                No se encontraron empleados para este periodo
              </p>
              <Button
                variant="secondary"
                icon={<ArrowLeft size={18} />}
                onClick={() => navigate("/nomina")}
                className="mt-2"
              >
                Volver a Nóminas
              </Button>
            </div>
          </div>
        )}
      </Card>

    {voucher && <VoucherEmpleado voucher={voucher} />}

   
    </div>
  );
}

export default NominaDetallePage;
