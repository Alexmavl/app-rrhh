import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departamentosService } from "../../../services/departamentos.service";
import type { Departamento } from "../../../services/departamentos.service";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { swalConfig } from "../../../utils/swalConfig";

export default function DepartamentosPage() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Departamento | null>(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const queryClient = useQueryClient();

  /** 🔹 Cargar departamentos */
  const { data: departamentos = [], isLoading, isError } = useQuery({
    queryKey: ["departamentos"],
    queryFn: departamentosService.listar,
  });

  /** 💾 Crear / Editar */
  const guardar = useMutation({
    mutationFn: async () => {
      if (selected) {
        await departamentosService.editar(selected.id, form);
      } else {
        await departamentosService.crear(form);
      }
    },
    onSuccess: async () => {
      await swalConfig.fire({
        icon: "success",
        title: "✅ Operación exitosa",
        text: selected
          ? "El departamento fue actualizado correctamente."
          : "El nuevo departamento fue creado con éxito.",
      });
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      setShowForm(false);
      setSelected(null);
      setForm({ nombre: "", descripcion: "" });
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

  /** 🔍 Filtrar búsqueda */
  const departamentosFiltrados = useMemo(() => {
    const query = search.toLowerCase();
    return departamentos.filter(
      (d) =>
        d.nombre.toLowerCase().includes(query) ||
        (d.descripcion?.toLowerCase() ?? "").includes(query)
    );
  }, [departamentos, search]);

  /** 📄 Paginación */
  const totalPages = Math.ceil(departamentosFiltrados.length / itemsPerPage);
  const paginatedData = departamentosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  React.useEffect(() => setPage(1), [search]);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-red-600 text-center mt-4">
        ⚠️ Error al cargar departamentos.
      </p>
    );

  /** 🧩 Columnas — índice, nombre, descripción y acciones */
  const columns: { key: keyof (Departamento & { index: number; acciones: React.ReactNode }); label: string }[] = [
    { key: "index", label: "#" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "acciones", label: "Acciones" },
  ];

  /** 🧮 Datos adaptados — solo botón amarillo “Editar” */
  const tableData = paginatedData.map((dep, i) => ({
    ...dep,
    index: (page - 1) * itemsPerPage + (i + 1),
    acciones: (
      <Button
        variant="warning"
        onClick={() => {
          setSelected(dep);
          setForm({ nombre: dep.nombre, descripcion: dep.descripcion || "" });
          setShowForm(true);
        }}
        className="text-sm"
      >
        ✏️ Editar
      </Button>
    ),
  }));

  return (
    <div className="space-y-6 text-gray-900 transition-colors">
      {/* 🧭 Encabezado */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Departamentos</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setForm({ nombre: "", descripcion: "" });
            setShowForm(true);
          }}
        >
          ➕ Nuevo departamento
        </Button>
      </div>

      {/* 🔍 Buscador */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* 🧱 Tabla */}
      {departamentosFiltrados.length > 0 ? (
        <>
          <Table data={tableData} columns={columns} />

          {/* 🔢 Paginación */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span>
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
        <p className="text-gray-500 italic">
          No se encontraron departamentos.
        </p>
      )}

      {/* 🪟 Modal */}
      <Modal
        show={showForm}
        title={selected ? "Editar Departamento" : "Nuevo Departamento"}
        onClose={() => setShowForm(false)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
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

            if (result.isConfirmed) guardar.mutate();
          }}
          className="space-y-3"
        >
          <Input
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            label="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={guardar.isPending}>
              {selected ? "Guardar cambios" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
