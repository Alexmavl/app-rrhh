import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empleadosService } from "../../../services/empleados.service";
import type { Empleado } from "../../../models/empleado.model";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { EmpleadoForm } from "../components/EmpleadoForm";
import { Input } from "../../../components/ui/Input";
import { ToggleSwitch } from "../../../components/ui/ToggleSwitch";
import { swalConfig } from "../../../utils/swalConfig";

export default function EmpleadosPage() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Empleado | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "activos" | "inactivos">("todos");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  /** 🧾 Cargar empleados */
  const {
    data: empleados = [],
    isLoading,
    isError,
  } = useQuery<Empleado[]>({
    queryKey: ["empleados"],
    queryFn: empleadosService.listar,
  });

  /** 🔁 Activar / Desactivar empleado (toggle) */
  const toggleActivo = useMutation({
    mutationFn: (id: number) => empleadosService.toggleActivo(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
    },
    onError: async (err: any) => {
      await swalConfig.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "No se pudo cambiar el estado del empleado.",
      });
    },
  });

  /** ✏️ Editar empleado */
  const handleEdit = (empleado: Empleado) => {
    setSelected(empleado);
    setShowForm(true);
  };

  /** ✅ Cerrar modal y recargar lista */
  const handleCloseForm = () => {
    setSelected(null);
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ["empleados"] });
  };

  /** 🧮 Filtrar y buscar empleados localmente */
  const empleadosFiltrados = useMemo(() => {
    return empleados
      .filter((emp) => {
        if (filter === "activos") return emp.activo;
        if (filter === "inactivos") return !emp.activo;
        return true;
      })
      .filter((emp) => {
        const query = search.toLowerCase();
        return (
          emp.nombres.toLowerCase().includes(query) ||
          emp.apellidos.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query)
        );
      });
  }, [empleados, search, filter]);

  /** 📄 Calcular paginación */
  const totalPages = Math.ceil(empleadosFiltrados.length / itemsPerPage);
  const paginatedData = empleadosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /** 🔁 Reiniciar página al cambiar búsqueda o filtro */
  React.useEffect(() => {
    setPage(1);
  }, [search, filter]);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-danger-light dark:text-danger-dark text-center mt-4">
        ⚠️ Error al cargar empleados.
      </p>
    );

  /** 🧩 Columnas — índice, código, datos, estado, acciones */
  const columns: { key: keyof (Empleado & { index: number; codigo: string; acciones: React.ReactNode }); label: string }[] = [
    { key: "index", label: "#" },
    { key: "codigo", label: "Código de Empleado" },
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos" },
    { key: "email", label: "Correo" },
    { key: "estadoLaboral", label: "Estado laboral" },
    { key: "activo", label: "Activo" },
    { key: "acciones", label: "Acciones" },
  ];

  /** 🧮 Adaptar datos para la tabla */
  const tableData = paginatedData.map((emp, i) => ({
    ...emp,
    index: (page - 1) * itemsPerPage + (i + 1),
    codigo: `EMP-${String(emp.id).padStart(4, "0")}`, // ejemplo: EMP-0005
    activo: (
      <ToggleSwitch
        checked={emp.activo}
        color={emp.activo ? "success" : "danger"}
        onChange={async () => {
          const result = await swalConfig.fire({
            title: emp.activo ? "¿Desactivar empleado?" : "¿Activar empleado?",
            text: `¿Deseas ${emp.activo ? "desactivar" : "activar"} a ${emp.nombres} ${emp.apellidos}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: emp.activo ? "Sí, desactivar" : "Sí, activar",
            cancelButtonText: "Cancelar",
          });

          if (result.isConfirmed) toggleActivo.mutate(emp.id);
        }}
      />
    ),
    acciones: (
  <Button
    variant="warning"
    className={`text-sm ${
      !emp.activo ? "opacity-50 cursor-not-allowed" : ""
    }`}
    onClick={() => handleEdit(emp)}
    disabled={!emp.activo} // 🔒 desactivar cuando el empleado está inactivo
  >
    ✏️ Editar
  </Button>
),

  }));

  return (
    <div className="space-y-6 text-text-light dark:text-text-dark transition-colors">
      {/* 🧭 Encabezado */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Empleados</h1>
        <Button onClick={() => setShowForm(true)}>➕ Nuevo empleado</Button>
      </div>

      {/* 🔍 Buscador y Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Buscar por nombre, apellido o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-lg border bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light dark:focus:ring-brand-dark transition"
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      {/* 🧱 Tabla o mensaje vacío */}
      {empleadosFiltrados.length > 0 ? (
        <>
          <Table data={tableData} columns={columns} />

          {/* 🔢 Controles de paginación */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Página {page} de {totalPages || 1}
            </span>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                ⬅️ Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Siguiente ➡️
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">
          No se encontraron empleados.
        </p>
      )}

      {/* 🪟 Modal */}
      <Modal
        show={showForm}
        title={selected ? "Editar Empleado" : "Nuevo Empleado"}
        onClose={handleCloseForm}
      >
        <EmpleadoForm empleado={selected} onSuccess={handleCloseForm} />
      </Modal>
    </div>
  );
}
