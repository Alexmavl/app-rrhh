import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { NominaForm } from "../components/NominaForm";
import { BeneficioModal } from "../components/BeneficioModal";
import { nominaService } from "../../../services/nomina.service";
import { swalSuccess, swalError } from "../../../utils/swalConfig";

/**
 *  Página principal de Nóminas
 * Muestra una fila por periodo (nóminas agrupadas).
 */
export function NominaPage(): React.JSX.Element {
  const [nominas, setNominas] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBeneficio, setShowBeneficio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**  Función utilitaria para formato de fecha (dd/mm/yyyy) */
  const formatDate = (date: string | Date | null) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("es-GT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  /**  Cargar nóminas agrupadas por periodo */
  const fetchNominas = async () => {
    try {
      setIsLoading(true);
      const data = await nominaService.listarResumen(); //  llama al nuevo endpoint
      setNominas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      swalError("Error al cargar nóminas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominas();
  }, []);

  const handleVerDetalle = (periodo: string) => {
  const safePeriodo = encodeURIComponent(periodo);
  navigate(`/nomina/detalle/${safePeriodo}`);
};
  /**  Columnas de la tabla principal (resumen global por periodo) */
  const columns = [
    { key: "periodo", label: "Periodo" },
    { key: "tipoPeriodo", label: "Tipo" },
    {
      key: "fechaInicio",
      label: "Inicio",
      render: (v: any) => formatDate(v),
    },
    {
      key: "fechaFin",
      label: "Fin",
      render: (v: any) => formatDate(v),
    },
    {
      key: "fechaProcesada",
      label: "Procesada",
      render: (v: any) => formatDate(v),
    },
    {
      key: "totalEmpleados",
      label: "Empleados",
      align: "center" as const,
    },
    {
      key: "totalLiquidoGlobal",
      label: "Total Nómina (Q)",
      align: "right" as const,
      render: (v: any) => `Q${Number(v || 0).toFixed(2)}`,
    },
    {
      key: "estado",
      label: "Estado",
      render: (v: any) =>
        v === "Activa" ? (
          <span className="text-green-700 font-semibold">Activa</span>
        ) : (
          <span className="text-gray-500">Inactiva</span>
        ),
    },
    {
      key: "acciones",
      label: "Acciones",
      align: "center" as const,
      render: (_: any, row: any) => (
        <div className="flex gap-2 justify-center">
        <Button size="sm" onClick={() => handleVerDetalle(row.periodo)}>
  🔍 Detalle
</Button>

        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-4">
      {/*  Encabezado */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          Nóminas procesadas por periodo
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowBeneficio(true)}>
            + Beneficio global
          </Button>
          <Button onClick={() => setShowForm(true)}>+ Nueva Nómina</Button>
        </div>
      </div>

      {/* Tabla de nóminas resumidas */}
      <Card>
        <Table
          data={nominas}
          columns={columns}
          loading={isLoading}
          emptyMessage="No hay nóminas registradas"
        />
      </Card>

      {/* Modal: Generar nueva nómina */}
      {showForm && (
        <Modal
          show={true}
          title="Procesar Nómina"
          onClose={() => setShowForm(false)}
        >
          <NominaForm
            onClose={() => setShowForm(false)}
            onSuccess={fetchNominas}
          />
        </Modal>
      )}

      {/* Modal: Registrar beneficio global */}
      {showBeneficio && (
        <Modal
          show={true}
          title="Registrar Beneficio o Descuento"
          onClose={() => setShowBeneficio(false)}
        >
          <BeneficioModal
            onClose={() => setShowBeneficio(false)}
            onSuccess={fetchNominas}
          />
        </Modal>
      )}
    </div>
  );
}

export default NominaPage;
