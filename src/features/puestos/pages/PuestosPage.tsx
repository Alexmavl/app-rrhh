import React, { useState, useMemo, useEffect } from "react";
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
  // Activar / Inactivar puesto (con confirmación y validación de empleados activos)
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

    if (!result.isConfirmed) return null; //  Usuario canceló
    return await puestosService.toggleActivo(puesto.id);
  },
  onSuccess: async (res) => {
    if (!res) return; // No hubo confirmación

    await swalConfig.fire({
      icon: res?.nuevoEstado ? "success" : "info",
      title: "Estado actualizado",
      text: res?.mensaje || "El estado del puesto fue cambiado correctamente.",
      confirmButtonText: "Entendido",
    });

    queryClient.invalidateQueries({ queryKey: ["puestos"] });
  },
  onError: async (err: any) => {
  // 👀 Mostrar en consola para inspección y debugging
  console.error("Error toggleActivo:", err.response?.data);

  const data = err.response?.data || {};
  const message =
    data.message ||
    data.mensaje ||
    data.error ||
    (typeof data === "string" ? data : "Error al cambiar estado del puesto.");

  // 🔍 Detección de mensaje específico del SP
  if (message.toLowerCase().includes("empleados activos")) {
    await swalConfig.fire({
      icon: "warning",
      title: "No se puede desactivar el puesto",
      text:
        "Este puesto tiene empleados activos asignados. " +
        "Primero debes reasignarlos o inactivarlos antes de continuar.",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#facc15", // Amarillo
    });
  } else {
    // 🚨 Cualquier otro error genérico
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

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <p className="text-red-600 text-center mt-4">Error al cargar puestos.</p>;

  const columns: {
    key: keyof (Puesto & { index: number; acciones: React.ReactNode });
    label: string;
  }[] = [
    { key: "index", label: "#" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "salarioBase", label: "Salario Base (Q)" },
    { key: "acciones", label: "Acciones" },
  ];

  const tableData = paginatedData.map((p, index) => ({
    ...p,
    index: (page - 1) * itemsPerPage + index + 1,
    salarioBase: Number(p.salarioBase || 0).toFixed(2),
    acciones: (
      <div className="flex gap-3 items-center">
       <ToggleSwitch
  checked={p.activo}
  onChange={() => toggleActivo.mutate(p)} //  ahora pasamos el puesto completo
  color={p.activo ? "success" : "danger"}
  label={p.activo ? "Activo" : "Inactivo"}
/>

        <Button
          variant="secondary"
          className={`text-sm ${
            p.activo
              ? "bg-yellow-400 hover:bg-yellow-500 text-black"
              : "bg-gray-300 cursor-not-allowed opacity-60"
          }`}
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
        >
          Editar
        </Button>
      </div>
    ),
  }));

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Puestos</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setForm({ nombre: "", descripcion: "", salarioBase: 0 });
            setShowForm(true);
          }}
        >
          Nuevo puesto
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      {puestosFiltrados.length > 0 ? (
        <>
          <Table data={tableData} columns={columns} />
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
                Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 italic">No se encontraron puestos.</p>
      )}

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
