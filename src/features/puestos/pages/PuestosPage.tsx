import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { puestosService } from "../../../services/puestos.service";
import type { Puesto } from "../../../services/puestos.service";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { swalConfig } from "../../../utils/swalConfig";
import { ToggleSwitch } from "../../../components/ui/ToggleSwitch";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Save,
} from "lucide-react";

export default function PuestosPage() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Puesto | null>(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", salarioBase: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const queryClient = useQueryClient();

  // Cargar puestos
  const { data: puestos = [], isLoading, isError } = useQuery({
    queryKey: ["puestos"],
    queryFn: puestosService.listar,
  });

  // Crear o editar
  const guardar = useMutation({
    mutationFn: async () => {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        salarioBase: Number(form.salarioBase),
      };
      if (selected) await puestosService.editar(selected.id, payload);
      else await puestosService.crear(payload);
    },
    onSuccess: async () => {
      await swalConfig.fire({
        icon: "success",
        title: "Operación exitosa",
        text: selected
          ? "El puesto fue actualizado correctamente."
          : "El nuevo puesto fue creado con éxito.",
      });
      queryClient.invalidateQueries({ queryKey: ["puestos"] });
      setShowForm(false);
      setSelected(null);
      setForm({ nombre: "", descripcion: "", salarioBase: 0 });
    },
    onError: async (err: any) => {
      await swalConfig.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Ocurrió un error al guardar el puesto.",
      });
    },
  });

  // Activar / Inactivar
  const toggleActivo = useMutation({
    mutationFn: async (puesto: Puesto) => {
      const accion = puesto.activo ? "desactivar" : "activar";
      const result = await swalConfig.fire({
        title: `¿Estás seguro de ${accion} este puesto?`,
        text: puesto.activo
          ? "Si lo desactivas, los empleados asociados podrían verse afectados."
          : "El puesto será reactivado y podrá asignarse a empleados nuevamente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sí, ${accion}`,
        cancelButtonText: "Cancelar",
        confirmButtonColor: puesto.activo ? "#d33" : "#3085d6",
      });

      if (!result.isConfirmed) return null;
      return await puestosService.toggleActivo(puesto.id);
    },
    onSuccess: async (res) => {
      if (!res) return;

      await swalConfig.fire({
        icon: res?.nuevoEstado ? "success" : "info",
        title: "Estado actualizado",
        text: res?.mensaje || "El estado del puesto fue cambiado correctamente.",
        confirmButtonText: "Entendido",
      });

      queryClient.invalidateQueries({ queryKey: ["puestos"] });
    },
    onError: async (err: any) => {
      console.error("Error toggleActivo:", err.response?.data);

      const data = err.response?.data || {};
      const message =
        data.message ||
        data.mensaje ||
        data.error ||
        (typeof data === "string" ? data : "Error al cambiar estado del puesto.");

      if (message.toLowerCase().includes("empleados activos")) {
        await swalConfig.fire({
          icon: "warning",
          title: "No se puede desactivar el puesto",
          text:
            "Este puesto tiene empleados activos asignados. " +
            "Primero debes reasignarlos o inactivarlos antes de continuar.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#facc15",
        });
      } else {
        await swalConfig.fire({
          icon: "error",
          title: "Error al cambiar estado",
          text: message,
          confirmButtonText: "Cerrar",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["puestos"] });
    },
  });

  // Filtrar búsqueda
  const puestosFiltrados = useMemo(() => {
    const query = search.toLowerCase();
    return puestos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        (p.descripcion?.toLowerCase() ?? "").includes(query)
    );
  }, [puestos, search]);

  // Paginación
  const totalPages = Math.ceil(puestosFiltrados.length / itemsPerPage);
  const paginatedData = puestosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => setPage(1), [search]);

  if (isLoading) return <LoadingSpinner fullScreen text="Cargando puestos..." />;
  
  if (isError) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-500 mb-4">Error al cargar puestos.</p>
        <Button onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  const columns: {
    key: keyof (Puesto & { index: number; acciones: React.ReactNode });
    label: string;
    width?: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "index", label: "#", width: "60px", align: "center" },
    { key: "nombre", label: "Nombre", width: "25%" },
    { key: "descripcion", label: "Descripción" },
    { key: "salarioBase", label: "Salario Base", width: "150px", align: "right" },
    { key: "acciones", label: "Acciones", width: "200px", align: "center" },
  ];

  const tableData = paginatedData.map((p, index) => ({
    ...p,
    index: (page - 1) * itemsPerPage + index + 1,
    salarioBase: `Q${Number(p.salarioBase || 0).toLocaleString("es-GT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    acciones: (
      <div className="flex gap-2 items-center justify-center">
        <ToggleSwitch
          checked={p.activo}
          onChange={() => toggleActivo.mutate(p)}
          color={p.activo ? "success" : "danger"}
          label={p.activo ? "Activo" : "Inactivo"}
        />
        <Button
          variant="warning"
          size="sm"
          icon={<Edit size={14} />}
          onClick={() => {
            if (!p.activo) return;
            setSelected(p);
            setForm({
              nombre: p.nombre,
              descripcion: p.descripcion,
              salarioBase: p.salarioBase,
            });
            setShowForm(true);
          }}
          disabled={!p.activo}
          className={!p.activo ? "opacity-50 cursor-not-allowed" : ""}
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
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: "#023778" }}
            >
              <Briefcase size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Puestos</h1>
              <p className="text-sm text-gray-600">
                {puestosFiltrados.length} puesto{puestosFiltrados.length !== 1 ? "s" : ""} encontrado{puestosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            icon={<Plus size={18} />}
            onClick={() => {
              setSelected(null);
              setForm({ nombre: "", descripcion: "", salarioBase: 0 });
              setShowForm(true);
            }}
          >
            Nuevo puesto
          </Button>
        </div>
      </Card>

      {/* Buscador */}
      <Card>
        <Input
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={18} />}
        />
      </Card>

      {/* Tabla */}
      <Card padding="none">
        {puestosFiltrados.length > 0 ? (
          <>
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
                {Math.min(page * itemsPerPage, puestosFiltrados.length)} de{" "}
                {puestosFiltrados.length} puestos
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
          </>
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-gray-100 rounded-full">
                <Briefcase size={48} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No se encontraron puestos
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {search 
                    ? "Intenta ajustar los filtros de búsqueda" 
                    : "Comienza agregando tu primer puesto"}
                </p>
              </div>
              {!search && (
                <Button
                  icon={<Plus size={18} />}
                  onClick={() => {
                    setSelected(null);
                    setForm({ nombre: "", descripcion: "", salarioBase: 0 });
                    setShowForm(true);
                  }}
                  className="mt-2"
                >
                  Agregar puesto
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        show={showForm}
        title={selected ? "Editar Puesto" : "Nuevo Puesto"}
        onClose={() => {
          setShowForm(false);
          setForm({ nombre: "", descripcion: "", salarioBase: 0 });
          setSelected(null);
        }}
        size="md"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.nombre.trim() || form.salarioBase <= 0) {
              await swalConfig.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Debes ingresar un nombre y un salario base válido.",
              });
              return;
            }
            const result = await swalConfig.fire({
              title: selected ? "¿Guardar cambios?" : "¿Crear nuevo puesto?",
              text: selected
                ? "Los cambios se aplicarán inmediatamente."
                : "El nuevo puesto será agregado al sistema.",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: selected ? "Sí, guardar" : "Sí, crear",
              cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) guardar.mutate();
          }}
          className="space-y-4"
        >
          <Input
            label="Nombre"
            placeholder="Ej: Gerente de Ventas"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            leftIcon={<Briefcase size={18} />}
            required
          />
          <Input
            label="Descripción"
            placeholder="Descripción del puesto"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
          <Input
            label="Salario Base"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.salarioBase}
            onChange={(e) =>
              setForm({ ...form, salarioBase: parseFloat(e.target.value) || 0 })
            }
            leftIcon={<DollarSign size={18} />}
            helperText="Ingresa el salario base mensual"
            required
          />
          <div className="flex justify-end pt-2 border-t">
            <Button
              type="submit"
              disabled={guardar.isPending}
              loading={guardar.isPending}
              icon={<Save size={18} />}
            >
              {selected ? "Guardar cambios" : "Crear puesto"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}