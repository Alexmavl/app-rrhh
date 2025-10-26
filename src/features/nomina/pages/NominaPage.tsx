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
import { swalSuccess, swalError, swalConfirm } from "../../../utils/swalConfig";

/**
 * 📄 Página principal de Nóminas
 * Lista las nóminas procesadas por periodo.
 */
export function NominaPage(): React.JSX.Element {
  const [nominas, setNominas] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBeneficio, setShowBeneficio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /** 🔹 Función utilitaria para formato de fecha (dd/mm/yyyy) */
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

  /** 🔹 Cargar todas las nóminas */
  const fetchNominas = async () => {
    try {
      setIsLoading(true);
      const data = await nominaService.listar();
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

  /** 🔹 Cambiar estado Activo/Inactivo */
  const handleToggleEstado = async (id: number) => {
    const confirm = await swalConfirm("¿Cambiar estado de la nómina?");
    if (!confirm.isConfirmed) return;
    try {
      await nominaService.toggleActivo(id);
      swalSuccess("Estado actualizado correctamente");
      fetchNominas();
    } catch (err) {
      swalError("Error al cambiar estado de la nómina");
    }
  };

  /** 🔹 Ver detalle (redirigir a NominaDetallePage) */
  const handleVerDetalle = (id: number) => {
    navigate(`/nomina/${id}`);
  };

  /** 🔹 Columnas de la tabla principal */
  const columns = [
    { key: "id", label: "Nómina #" },
    { key: "periodo", label: "Periodo" },
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
      key: "activo",
      label: "Estado",
      render: (v: any) =>
        v ? (
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
          <Button size="sm" onClick={() => handleVerDetalle(row.id)}>
            🔍 Detalle
          </Button>
          <Button
            size="sm"
            variant={row.activo ? "secondary" : "ghost"}
            onClick={() => handleToggleEstado(row.id)}
          >
            {row.activo ? "Desactivar" : "Activar"}
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          Nóminas procesadas
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowBeneficio(true)}>
            + Beneficio global
          </Button>
          <Button onClick={() => setShowForm(true)}>+ Nueva Nómina</Button>
        </div>
      </div>

      {/* Tabla */}
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
        <Modal show={true} title="Procesar Nómina" onClose={() => setShowForm(false)}>
          <NominaForm
            onClose={() => setShowForm(false)}
            onSuccess={fetchNominas}
          />
        </Modal>
      )}

      {/* Modal: Beneficio global */}
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
