import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { puestosService } from "../../../services/puestos.service";
import type { Puesto } from "../../../services/puestos.service";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { swalConfig } from "../../../utils/swalConfig";
import { ToggleSwitch } from "../../../components/ui/ToggleSwitch";

export default function PuestosPage() {
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Puesto | null>(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", salarioBase: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const queryClient = useQueryClient();

  /** 🔹 Cargar puestos */
  const { data: puestos = [], isLoading, isError } = useQuery({
    queryKey: ["puestos"],
    queryFn: puestosService.listar,
  });

  /** 💾 Crear / Editar */
  const guardar = useMutation({
    mutationFn: async () => {
      if (selected) {
        await puestosService.editar(selected.id, form);
      } else {
        await puestosService.crear(form);
      }
    },
    onSuccess: async () => {
      await swalConfig.fire({
        icon: "success",
        title: "¡Operación exitosa!",
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
        text:
          err.response?.data?.message ||
          "Ocurrió un error al guardar el puesto.",
      });
    },
  });
/** 🔁 Activar/Inactivar (toggle con validación de empleados activos) */
const toggleActivo = useMutation({
  mutationFn: (id: number) => puestosService.toggleActivo(id),
  onSuccess: async (res) => {
    await swalConfig.fire({
      icon: res?.nuevoEstado ? "success" : "info",
      title: "Estado actualizado",
      text: res?.mensaje || "El estado del puesto fue cambiado correctamente.",
      confirmButtonText: "Entendido",
    });
    queryClient.invalidateQueries({ queryKey: ["puestos"] });
  },
  onError: async (err: any) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.message ||
      "Error al cambiar el estado del puesto.";

    // 🧩 Detectar casos de conflicto lógico (status 409)
    if (status === 409 || message.includes("empleados activos")) {
      await swalConfig.fire({
        icon: "warning",
        title: "Puesto con empleados activos",
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#facc15", // amarillo
      });
    } else {
      await swalConfig.fire({
        icon: "error",
        title: "Error al cambiar estado",
        text: message,
        confirmButtonText: "Entendido",
      });
    }
  },
});


  /** 🔍 Filtrar por búsqueda */
  const puestosFiltrados = useMemo(() => {
    const query = search.toLowerCase();
    return puestos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        (p.descripcion?.toLowerCase() ?? "").includes(query)
    );
  }, [puestos, search]);

  /** 📄 Paginación */
  const totalPages = Math.ceil(puestosFiltrados.length / itemsPerPage);
  const paginatedData = puestosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-danger-light text-center mt-4">
        ⚠️ Error al cargar puestos.
      </p>
    );

  /** 🧩 Columnas */
  const columns: { key: keyof (Puesto & { index: number; acciones: React.ReactNode }); label: string }[] = [
    { key: "index", label: "#" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "salarioBase", label: "Salario Base (Q)" },
    { key: "acciones", label: "Acciones" },
  ];

  /** 🧮 Datos adaptados */
  const tableData = paginatedData.map((p, index) => ({
    ...p,
    index: (page - 1) * itemsPerPage + index + 1,
    salarioBase: p.salarioBase.toFixed(2),
    acciones: (
      <div className="flex gap-3 items-center">
        {/* 🔘 Toggle de estado */}
        <ToggleSwitch
          checked={p.activo}
          onChange={() => toggleActivo.mutate(p.id)}
          color={p.activo ? "success" : "danger"}
          label={p.activo ? "Activo" : "Inactivo"}
        />

        {/* ✏️ Botón Editar */}
       <Button
  variant="secondary"
  className={`text-sm text-gray-900 ${
    p.activo
      ? "bg-yellow-400 hover:bg-yellow-500"
      : "bg-gray-300 cursor-not-allowed opacity-60"
  }`}
  onClick={() => {
    if (!p.activo) return; // 🔒 evita que abra el modal si está inactivo
    setSelected(p);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      salarioBase: p.salarioBase,
    });
    setShowForm(true);
  }}
  disabled={!p.activo} // 🚫 desactivar funcionalidad del botón
>
  ✏️ Editar
</Button>

      </div>
    ),
  }));

  return (
    <div className="space-y-6 text-gray-900">
      {/* 🧭 Encabezado */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Puestos</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setForm({ nombre: "", descripcion: "", salarioBase: 0 });
            setShowForm(true);
          }}
        >
          ➕ Nuevo puesto
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
      {puestosFiltrados.length > 0 ? (
        <>
          <Table data={tableData} columns={columns} />
          {/* 🔢 Paginación */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-600">
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
        <p className="text-gray-500 italic">No se encontraron puestos.</p>
      )}

      {/* 🪟 Modal */}
      <Modal
        show={showForm}
        title={selected ? "Editar Puesto" : "Nuevo Puesto"}
        onClose={() => {
          setShowForm(false);
          setForm({ nombre: "", descripcion: "", salarioBase: 0 });
          setSelected(null);
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // Validación simple
            if (!form.nombre.trim() || form.salarioBase <= 0) {
              await swalConfig.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Debes ingresar un nombre y un salario base válido.",
                confirmButtonText: "Entendido",
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
          className="space-y-3"
        >
          <Input
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />

          <Input
            label="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <Input
            label="Salario Base (Q)"
            type="number"
            step="0.01"
            value={form.salarioBase}
            onChange={(e) =>
              setForm({ ...form, salarioBase: parseFloat(e.target.value) || 0 })
            }
            required
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="success"
              disabled={guardar.isPending}
              className="min-w-[130px]"
            >
              {guardar.isPending
                ? "Guardando..."
                : selected
                ? "Guardar cambios"
                : "Crear puesto"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
