import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departamentosService } from "../../../services/departamentos.service";
import type { Departamento } from "../../../services/departamentos.service";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { swalConfig } from "../../../utils/swalConfig";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  Save,
} from "lucide-react";

/* Esquema de validación Zod */
const schema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" })
    .nonempty("El nombre es obligatorio"),
  descripcion: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" })
    .max(255, { message: "La descripción no puede exceder 255 caracteres" })
    .nonempty("La descripción es obligatoria"),
});

type FormData = z.infer<typeof schema>;

export default function DepartamentosPage() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Departamento | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const queryClient = useQueryClient();

  /* Cargar departamentos */
  const { data: departamentos = [], isLoading, isError } = useQuery({
    queryKey: ["departamentos"],
    queryFn: departamentosService.listar,
  });

  /* Hook de formulario con validación */
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", descripcion: "" },
  });

  /* Crear / Editar */
  const guardar = useMutation({
    mutationFn: async (data: FormData) => {
      if (selected) {
        await departamentosService.editar(selected.id, data);
      } else {
        await departamentosService.crear(data);
      }
    },
    onSuccess: async () => {
      await swalConfig.fire({
        icon: "success",
        title: " Operación exitosa",
        text: selected
          ? "El departamento fue actualizado correctamente."
          : "El nuevo departamento fue creado con éxito.",
      });
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      setShowForm(false);
      setSelected(null);
      reset();
    },
    onError: async (err: any) => {
      await swalConfig.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Ocurrió un error al guardar el departamento.",
      });
    },
  });

  /* Filtrar búsqueda */
  const departamentosFiltrados = useMemo(() => {
    const query = search.toLowerCase();
    return departamentos.filter(
      (d) =>
        d.nombre.toLowerCase().includes(query) ||
        (d.descripcion?.toLowerCase() ?? "").includes(query)
    );
  }, [departamentos, search]);

  /* Paginación */
  const totalPages = Math.ceil(departamentosFiltrados.length / itemsPerPage);
  const paginatedData = departamentosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  React.useEffect(() => setPage(1), [search]);

  if (isLoading) return <LoadingSpinner fullScreen text="Cargando departamentos..." />;
  
  if (isError) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-500 mb-4">Error al cargar departamentos.</p>
        <Button onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  /* Columnas */
  const columns: {
    key: keyof (Departamento & { index: number; acciones: React.ReactNode });
    label: string;
    width?: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "index", label: "#", width: "60px", align: "center" },
    { key: "nombre", label: "Nombre", width: "30%" },
    { key: "descripcion", label: "Descripción" },
    { key: "acciones", label: "Acciones", width: "150px", align: "center" },
  ];

  /* Datos */
  const tableData = paginatedData.map((dep, i) => ({
    ...dep,
    index: (page - 1) * itemsPerPage + (i + 1),
    acciones: (
      <Button
        variant="warning"
        size="sm"
        icon={<Edit size={14} />}
        onClick={() => {
          setSelected(dep);
          setValue("nombre", dep.nombre);
          setValue("descripcion", dep.descripcion || "");
          setShowForm(true);
        }}
      >
        Editar
      </Button>
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
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departamentos</h1>
              <p className="text-sm text-gray-600">
                {departamentosFiltrados.length} departamento{departamentosFiltrados.length !== 1 ? "s" : ""} encontrado{departamentosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            icon={<Plus size={18} />}
            onClick={() => {
              setSelected(null);
              reset();
              setShowForm(true);
            }}
          >
            Nuevo departamento
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
        {departamentosFiltrados.length > 0 ? (
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
                {Math.min(page * itemsPerPage, departamentosFiltrados.length)} de{" "}
                {departamentosFiltrados.length} departamentos
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
                <Building2 size={48} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No se encontraron departamentos
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {search 
                    ? "Intenta ajustar los filtros de búsqueda" 
                    : "Comienza agregando tu primer departamento"}
                </p>
              </div>
              {!search && (
                <Button
                  icon={<Plus size={18} />}
                  onClick={() => {
                    setSelected(null);
                    reset();
                    setShowForm(true);
                  }}
                  className="mt-2"
                >
                  Agregar departamento
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        show={showForm}
        title={selected ? "Editar Departamento" : "Nuevo Departamento"}
        onClose={() => setShowForm(false)}
        size="md"
      >
        <form
          onSubmit={handleSubmit(async (data) => {
            const result = await swalConfig.fire({
              title: selected ? "¿Guardar cambios?" : "¿Crear nuevo departamento?",
              text: selected
                ? "Los cambios se aplicarán inmediatamente."
                : "El nuevo departamento será agregado al sistema.",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: selected ? "Sí, guardar" : "Sí, crear",
              cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) guardar.mutate(data);
          })}
          className="space-y-4"
        >
          <Input
            label="Nombre"
            placeholder="Ej: Finanzas"
            leftIcon={<Building2 size={18} />}
            {...register("nombre")}
            error={errors.nombre?.message}
            required
          />

          <Input
            label="Descripción"
            placeholder="Ej: Área encargada de la contabilidad general"
            {...register("descripcion")}
            error={errors.descripcion?.message}
            required
          />

          <div className="flex justify-end pt-2 border-t">
            <Button 
              type="submit" 
              disabled={isSubmitting || guardar.isPending}
              loading={isSubmitting || guardar.isPending}
              icon={<Save size={18} />}
            >
              {selected ? "Guardar cambios" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}