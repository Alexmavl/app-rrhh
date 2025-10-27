import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empleadosService } from "../../../services/empleados.service";
import type { Empleado } from "../../../models/empleado.model";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { EmpleadoForm } from "../components/EmpleadoForm";
import { EmpleadoPerfilModal } from "../components/EmpleadoPerfilModal";
import { EmpleadosFormacionModal } from "../components/EmpleadosFormacionModal";
import { Input } from "../../../components/ui/Input";
import { ToggleSwitch } from "../../../components/ui/ToggleSwitch";
import { Card } from "../../../components/ui/Card";
import { swalConfirm, swalError, swalSuccess } from "../../../utils/swalConfig";
import { 
  Plus, 
  Search, 
  User, 
  GraduationCap, 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  Users,
} from "lucide-react";

export default function EmpleadosPage() {
  const [showForm, setShowForm] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showFormacion, setShowFormacion] = useState(false);
  const [selected, setSelected] = useState<Empleado | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "activos" | "inactivos">("todos");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const {
    data: empleados = [],
    isLoading,
    isError,
  } = useQuery<Empleado[]>({
    queryKey: ["empleados"],
    queryFn: empleadosService.listar,
  });

  const toggleActivo = useMutation({
    mutationFn: (id: number) => empleadosService.toggleActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      swalSuccess("Estado actualizado", "El estado del empleado se cambió correctamente");
    },
    onError: async (err: any) => {
      await swalError(
        "Error",
        err.response?.data?.message || "No se pudo cambiar el estado del empleado."
      );
    },
  });

  const handleEdit = (empleado: Empleado) => {
    setSelected(empleado);
    setShowForm(true);
  };

  const handlePerfil = (empleado: Empleado) => {
    setSelected(empleado);
    setShowPerfil(true);
  };

  const handleFormacion = (empleado: Empleado) => {
    setSelected(empleado);
    setShowFormacion(true);
  };

  const handleCloseModals = () => {
    setSelected(null);
    setShowForm(false);
    setShowPerfil(false);
    setShowFormacion(false);
    queryClient.invalidateQueries({ queryKey: ["empleados"] });
  };

  const empleadosFiltrados = useMemo(() => {
    return empleados.filter((emp) => {
      if (filter === "activos") return emp.activo;
      if (filter === "inactivos") return !emp.activo;
      const query = search.toLowerCase();
      return (
        emp.nombres.toLowerCase().includes(query) ||
        emp.apellidos.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.dpi.toLowerCase().includes(query)
      );
    });
  }, [empleados, search, filter]);

  const totalPages = Math.ceil(empleadosFiltrados.length / itemsPerPage);
  const paginatedData = empleadosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => setPage(1), [search, filter]);

  if (isLoading) return <LoadingSpinner fullScreen text="Cargando empleados..." />;
  
  if (isError) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-500 mb-4">Error al cargar empleados.</p>
        <Button onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  const columns: { 
    key: keyof Empleado | "index" | "codigo" | "acciones"; 
    label: string;
    width?: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "index", label: "#", width: "60px", align: "center" },
    { key: "codigo", label: "Código", width: "120px" },
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos" },
    { key: "nombreDepartamento", label: "Departamento" },
    { key: "nombrePuesto", label: "Puesto" },
    { key: "email", label: "Correo" },
    { key: "activo", label: "Estado", width: "100px", align: "center" },
    { key: "acciones", label: "Acciones", width: "300px", align: "center" },
  ];

  const tableData = paginatedData.map((emp, i) => ({
    ...emp,
    index: (page - 1) * itemsPerPage + (i + 1),
    codigo: `EMP-${String(emp.id).padStart(4, "0")}`,
    activo: (
      <ToggleSwitch
        checked={emp.activo}
        color={emp.activo ? "success" : "danger"}
        size="sm"
        onChange={async () => {
          const result = await swalConfirm(
            emp.activo ? "¿Desactivar empleado?" : "¿Activar empleado?",
            `¿Deseas ${emp.activo ? "desactivar" : "activar"} a ${emp.nombres}?`,
            emp.activo ? "Sí, desactivar" : "Sí, activar",
            "Cancelar"
          );
          if (result.isConfirmed) toggleActivo.mutate(emp.id);
        }}
      />
    ),
   acciones: (
  <div className="flex gap-2 justify-center flex-wrap">
    <Button
      variant="primary"
      size="sm"
      icon={<User size={14} />}
      onClick={() => handlePerfil(emp)}
      disabled={!emp.activo} // 👈 Deshabilitado si el empleado está inactivo
      title={!emp.activo ? "Empleado inactivo" : "Ver perfil"}
    >
      Perfil
    </Button>

    <Button
      variant="info"
      size="sm"
      icon={<GraduationCap size={14} />}
      onClick={() => handleFormacion(emp)}
      disabled={!emp.activo} // 👈 también aquí
      title={!emp.activo ? "Empleado inactivo" : "Ver formación y documentos"}
    >
      Formación
    </Button>

    <Button
      variant="warning"
      size="sm"
      icon={<Edit size={14} />}
      onClick={() => handleEdit(emp)}
      disabled={!emp.activo} // 👈 y aquí
      title={!emp.activo ? "Empleado inactivo" : "Editar información"}
    >
      Editar
    </Button>
  </div>
),

  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#023778" }}>
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
              <p className="text-sm text-gray-600">
                {empleadosFiltrados.length} empleado{empleadosFiltrados.length !== 1 ? "s" : ""} encontrado{empleadosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button 
            icon={<Plus size={18} />}
            onClick={() => setShowForm(true)}
          >
            Nuevo empleado
          </Button>
        </div>
      </Card>

      {/* Búsqueda y filtros */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, apellido, email o DPI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "todos" ? "primary" : "secondary"}
              size="md"
              onClick={() => setFilter("todos")}
            >
              Todos
            </Button>
            <Button
              variant={filter === "activos" ? "primary" : "secondary"}
              size="md"
              onClick={() => setFilter("activos")}
            >
              Activos
            </Button>
            <Button
              variant={filter === "inactivos" ? "primary" : "secondary"}
              size="md"
              onClick={() => setFilter("inactivos")}
            >
              Inactivos
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla */}
      {empleadosFiltrados.length > 0 ? (
        <Card padding="none">
          <Table 
            data={tableData} 
            columns={columns}
            striped
            hover
          />

          {/* Paginación */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Mostrando {(page - 1) * itemsPerPage + 1} a{" "}
              {Math.min(page * itemsPerPage, empleadosFiltrados.length)} de{" "}
              {empleadosFiltrados.length} empleados
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                icon={<ChevronLeft size={16} />}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-2 px-3">
                <span className="text-sm text-gray-600">
                  Página {page} de {totalPages || 1}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                icon={<ChevronRight size={16} />}
                iconPosition="right"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-full">
              <Users size={48} className="text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                No se encontraron empleados
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {search 
                  ? "Intenta ajustar los filtros de búsqueda" 
                  : "Comienza agregando tu primer empleado"}
              </p>
            </div>
            {!search && (
              <Button 
                icon={<Plus size={18} />}
                onClick={() => setShowForm(true)}
                className="mt-2"
              >
                Agregar empleado
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Modal Formulario de Empleado */}
      <Modal
        show={showForm}
        title={selected ? "Editar Empleado" : "Nuevo Empleado"}
        onClose={handleCloseModals}
        size="lg"
      >
        <EmpleadoForm empleado={selected} onSuccess={handleCloseModals} />
      </Modal>

      {/* Modal Perfil */}
      {selected && (
        <EmpleadoPerfilModal
          show={showPerfil}
          onClose={handleCloseModals}
          empleado={selected}
          onVerExpediente={(empleadoId) => {
            setShowPerfil(false);
            setSelected(selected);
            setShowFormacion(true);
          }}
        />
      )}

      {/* Modal Formación / Documentos */}
      {selected && (
        <EmpleadosFormacionModal
          show={showFormacion}
          onClose={handleCloseModals}
          empleadoId={selected.id}
        />
      )}
    </div>
  );
}