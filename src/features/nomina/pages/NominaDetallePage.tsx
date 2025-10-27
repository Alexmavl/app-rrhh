import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { nominaService } from "../../../services/nomina.service";
import { VoucherEmpleado } from "../components/VoucherEmpleado";
import { swalError } from "../../../utils/swalConfig";

function NominaDetallePage(): React.JSX.Element {
  const { periodo } = useParams<{ periodo: string }>();
  const navigate = useNavigate();

  const [nomina, setNomina] = useState<any[]>([]);
  const [voucher, setVoucher] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** Cargar detalle de nómina */
  const fetchNominaDetalle = async () => {
    if (!periodo) return;
    try {
      setIsLoading(true);
      const data = await nominaService.obtenerDetallePorPeriodo(periodo);
      setNomina(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      swalError("Error al obtener detalle de la nómina");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominaDetalle();
  }, [periodo]);

  /** Mostrar voucher */
  const handleVoucher = async (row: any) => {
    try {
      const res = await nominaService.obtenerVoucher(row.idEmpleado, row.periodo);
      console.log("Voucher generado:", res);
      if (res && res.length > 0) {
        setVoucher(res[0]);
      } else {
        swalError("No se encontró voucher para este empleado");
      }
    } catch (err) {
      console.error(err);
      swalError("Error al generar voucher");
    }
  };

  /** Cerrar modal */
  const handleCloseVoucher = () => setVoucher(null);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold text-gray-800">
          Detalle Nómina - {periodo?.replace("%20", " ")}
        </h1>
        <Button variant="secondary" onClick={() => navigate("/nomina")}>
          ← Volver
        </Button>
      </div>

      {/* Tabla de empleados */}
      <Card>
        <Table
          data={nomina}
          columns={[
            { key: "index", label: "#" },
            { key: "empleado", label: "Empleado" },
            { key: "puesto", label: "Puesto" },
            { key: "departamento", label: "Departamento" },
            {
              key: "salarioBase",
              label: "Salario Base",
              render: (v) => `Q${Number(v).toFixed(2)}`,
            },
            {
              key: "totalBonificaciones",
              label: "Bonificaciones",
              render: (v) => `Q${Number(v).toFixed(2)}`,
            },
            {
              key: "totalDescuentos",
              label: "Descuentos",
              render: (v) => `-Q${Number(v).toFixed(2)}`,
            },
            {
              key: "totalLiquido",
              label: "Total Líquido",
              render: (v) => `Q${Number(v).toFixed(2)}`,
            },
            {
              key: "acciones",
              label: "Acciones",
              render: (_, row) => (
                <Button size="sm" onClick={() => handleVoucher(row)}>
                  Voucher
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {/* Modal con el Voucher */}
      {voucher && (
        <Modal
          show={true}
          title={`Voucher de ${voucher.empleado}`}
          onClose={handleCloseVoucher}
          size="lg"
        >
          <VoucherEmpleado voucher={voucher} />
        </Modal>
      )}
    </div>
  );
}

export default NominaDetallePage;
