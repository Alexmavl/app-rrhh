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
import {
  DollarSign,
  Plus,
  Gift,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function NominaPage(): React.JSX.Element {
  const [nominas, setNominas] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [showBeneficio, setShowBeneficio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const navigate = useNavigate();

  /* Formatear fecha */
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

  /* Cargar nóminas */
  const fetchNominas = async () => {
    try {
      setIsLoading(true);
      const data = await nominaService.listarResumen();
      setNominas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      await swalError("Error", "No se pudieron cargar las nóminas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominas();
  }, []);

  /* Ver detalle */
  const handleVerDetalle = (periodo: string, estado: string) => {
    if (estado !== "Activa") return; // 🚫 Bloquear acceso si está inactiva
    const safePeriodo = encodeURIComponent(periodo);
    navigate(`/nomina/detalle/${safePeriodo}`);
  };

  /* Activar / Inactivar nómina */
  const handleToggleActivo = async (idNomina: number, estadoActual: string) => {
    try {
      const confirmar = await swalConfirm(
        `¿Deseas ${estadoActual === "Activa" ? "inactivar" : "activar"} esta nómina?`,
        "Esta acción cambiará el estado del periodo seleccionado.",
        estadoActual === "Activa" ? "Sí, inactivar" : "Sí, activar",
        "Cancelar"
      );
      if (!confirmar.isConfirmed) return;

      setIsLoading(true);
      await nominaService.toggleActivo(idNomina);

      await swalSuccess(
        `Nómina ${estadoActual === "Activa" ? "inactivada" : "activada"}`,
        "El estado se actualizó correctamente."
      );
      await fetchNominas();
    } catch (err) {
      console.error(err);
      await swalError("Error", "No se pudo cambiar el estado de la nómina");
    } finally {
      setIsLoading(false);
    }
  };

  /* Filtro de estado */
  const nominasFiltradas =
    filtroEstado === "Todas"
      ? nominas
      : nominas.filter((n) => n.estado === filtroEstado);

  /* 🔢 Paginación */
  const totalPaginas = Math.ceil(nominasFiltradas.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const nominasPaginadas = nominasFiltradas.slice(inicio, fin);

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  /* Columnas */
  const columns = [
    { key: "periodo", label: "Periodo", width: "150px" },
    { key: "tipoPeriodo", label: "Tipo", width: "120px" },
    {
      key: "fechaInicio",
      label: "Inicio",
      width: "120px",
      render: (v: any) => formatDate(v),
    },
    {
      key: "fechaFin",
      label: "Fin",
      width: "120px",
      render: (v: any) => formatDate(v),
    },
    {
      key: "fechaProcesada",
      label: "Procesada",
      width: "120px",
      render: (v: any) => formatDate(v),
    },
    {
      key: "totalEmpleados",
      label: "Empleados",
      width: "100px",
      align: "center" as const,
    },
    {
      key: "totalLiquidoGlobal",
      label: "Total (Q)",
      width: "150px",
      align: "right" as const,
      render: (v: any) => (
        <span className="font-semibold text-gray-900">
          Q
          {Number(v || 0).toLocaleString("es-GT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      width: "120px",
      align: "center" as const,
      render: (v: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
            v === "Activa"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {v === "Activa" ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {v}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      width: "240px",
      align: "center" as const,
      render: (_: any, row: any) => (
        <div className="flex gap-2 justify-center">
          {/* 🚫 Desactivar el botón si la nómina está inactiva */}
          <Button
            size="sm"
            variant="info"
            icon={<Eye size={14} />}
            onClick={() => handleVerDetalle(row.periodo, row.estado)}
            disabled={row.estado !== "Activa"}
            className={row.estado !== "Activa" ? "opacity-50 cursor-not-allowed" : ""}
          >
            Detalle
          </Button>
          <Button
            size="sm"
            variant={row.estado === "Activa" ? "danger" : "success"}
            icon={
              row.estado === "Activa" ? <XCircle size={14} /> : <CheckCircle size={14} />
            }
            onClick={() => handleToggleActivo(row.idNomina ?? row.id, row.estado)}
          >
            {row.estado === "Activa" ? "Inactivar" : "Activar"}
          </Button>
        </div>
      ),
    },
  ];

  /* Totales */
  const totalEmpleados = nominasFiltradas.reduce(
    (sum, n) => sum + (n.totalEmpleados || 0),
    0
  );
  const totalNomina = nominasFiltradas.reduce(
    (sum, n) => sum + (n.totalLiquidoGlobal || 0),
    0
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando nóminas..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#023778" }}>
              <DollarSign size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Nóminas</h1>
              <p className="text-sm text-gray-600">
                Revisa, activa o inactiva nóminas por periodo
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              icon={<Gift size={18} />}
              onClick={() => setShowBeneficio(true)}
              fullWidth
              className="md:w-auto"
            >
              Bonos o Descuentos
            </Button>
            <Button
              icon={<Plus size={18} />}
              onClick={() => setShowForm(true)}
              fullWidth
              className="md:w-auto"
            >
              Nueva Nómina
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card padding="none">
        {nominasPaginadas.length > 0 ? (
          <>
            <Table
              data={nominasPaginadas}
              columns={columns}
              loading={isLoading}
              striped
              hover
            />

            {/* 🔢 Controles de paginación */}
            <div className="flex justify-between items-center p-4 text-sm text-gray-600">
              <span>
                Página {paginaActual} de {totalPaginas} — Mostrando {itemsPorPagina} por página
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  icon={<ChevronLeft size={16} />}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  icon={<ChevronRight size={16} />}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">No hay nóminas disponibles.</div>
        )}
      </Card>

      {/* Modales */}
      <Modal show={showForm} title="Procesar Nómina" onClose={() => setShowForm(false)} size="lg">
        <NominaForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchNominas();
            setShowForm(false);
          }}
        />
      </Modal>

      <Modal
        show={showBeneficio}
        title="Registrar Beneficio o Descuento"
        onClose={() => setShowBeneficio(false)}
        size="md"
      >
        <BeneficioModal
          onClose={() => setShowBeneficio(false)}
          onSuccess={() => {
            fetchNominas();
            setShowBeneficio(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default NominaPage;
