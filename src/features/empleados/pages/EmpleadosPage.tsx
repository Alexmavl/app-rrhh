// src/features/empleados/pages/EmpleadosPage.tsx
import { useContext, useState } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Table } from "../../../components/ui/Table";
import { useFetch } from "../../../hooks/useFetch";
import { empleadosService } from "../../../services/empleados.service";
import { AuthContext } from "../../../context/AuthContext";
import type { Empleado } from "../../../models/empleado.model";
import { EmpleadoForm } from "../components/EmpleadoForm";

export default function EmpleadosPage() {
  const { user } = useContext(AuthContext)!;
  const { data: empleados, loading, error, setData } = useFetch<Empleado[]>("/empleados", []);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Empleado | null>(null);

  const handleToggle = async (id: number) => {
    if (!confirm("¿Seguro que deseas cambiar el estado de este empleado?")) return;
    const res = await empleadosService.toggleActivo(id);
    alert(res.mensaje || "Estado actualizado");
    // Recarga la lista
    const nuevos = await empleadosService.listar();
    setData(nuevos);
  };

  const handleEdit = (empleado: Empleado) => {
    setSelected(empleado);
    setShowModal(true);
  };

  const handleNew = () => {
    setSelected(null);
    setShowModal(true);
  };

  if (loading) return <p className="text-center mt-10">Cargando empleados...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!empleados?.length) return <p className="text-center mt-10">No hay empleados registrados.</p>;

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">👥 Empleados</h1>

      {(user?.rol === "Admin" || user?.rol === "RRHH") && (
        <div className="flex justify-end mb-3">
          <Button onClick={handleNew}>➕ Nuevo Empleado</Button>
        </div>
      )}

      <Card>
        <Table
          columns={[
            { key: "id", label: "ID" },
            { key: "nombres", label: "Nombres" },
            { key: "apellidos", label: "Apellidos" },
            { key: "nombreDepartamento", label: "Departamento" },
            { key: "nombrePuesto", label: "Puesto" },
            { key: "email", label: "Correo" },
            { key: "estadoLaboral", label: "Estado" },
          ]}
          data={empleados}
        />
        {(user?.rol === "Admin" || user?.rol === "RRHH") && (
          <div className="mt-4 flex flex-wrap gap-2">
            {empleados.map((e) => (
              <div key={e.id} className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(e)}>
                  ✏️ Editar
                </Button>
                <Button variant="danger" onClick={() => handleToggle(e.id)}>
                  {e.activo ? "Desactivar" : "Activar"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        show={showModal}
        title={selected ? "Editar Empleado" : "Nuevo Empleado"}
        onClose={() => setShowModal(false)}
      >
        <EmpleadoForm
          empleado={selected}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            const nuevos = await empleadosService.listar();
            setData(nuevos);
            setShowModal(false);
          }}
        />
      </Modal>
    </MainLayout>
  );
}
