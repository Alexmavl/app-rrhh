// src/features/nomina/pages/NominaPage.tsx
import { useContext, useState } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { useFetch } from "../../../hooks/useFetch";
import { AuthContext } from "../../../context/AuthContext";
import { nominaService } from "../../../services/nomina.service";
import { NominaForm } from "../components/NominaForm";
import type { Nomina } from "../../../models/nomina.model";

export default function NominaPage() {
  const { user } = useContext(AuthContext)!;
  const { data: nominas, loading, error, setData } = useFetch<Nomina[]>("/nominas", []);
  const [detalle, setDetalle] = useState<Nomina | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleDetalle = async (id: number) => {
    const data = await nominaService.obtenerPorId(id);
    setDetalle(data);
    setShowModal(true);
  };

  if (loading) return <p className="text-center mt-10">Cargando nóminas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">💰 Nómina</h1>

      {(user?.rol === "Admin" || user?.rol === "RRHH") && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowForm(true)}>🧾 Generar Nómina</Button>
        </div>
      )}

      <Card>
        <Table
          columns={[
            { key: "id", label: "ID" },
            { key: "nombreEmpleado", label: "Empleado" },
            { key: "periodo", label: "Periodo" },
            { key: "salarioBase", label: "Salario Base" },
            { key: "totalPagar", label: "Total a Pagar" },
            { key: "fechaGeneracion", label: "Fecha" },
          ]}
          data={nominas || []}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {nominas?.map((n) => (
            <Button key={n.id} variant="secondary" onClick={() => handleDetalle(n.id)}>
              👁️ Ver Detalle
            </Button>
          ))}
        </div>
      </Card>

      {/* Modal Detalle */}
      <Modal show={showModal} title="Detalle de Nómina" onClose={() => setShowModal(false)}>
        {detalle ? (
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {detalle.id}</p>
            <p><strong>Empleado:</strong> {detalle.nombreEmpleado}</p>
            <p><strong>Periodo:</strong> {detalle.periodo}</p>
            <p><strong>Salario Base:</strong> Q{detalle.salarioBase.toFixed(2)}</p>
            <p><strong>Bonificación:</strong> Q{detalle.bonificacion?.toFixed(2) || 0}</p>
            <p><strong>Descuentos:</strong> Q{detalle.descuentos?.toFixed(2) || 0}</p>
            <p><strong>Total a Pagar:</strong> <span className="font-bold text-green-600">Q{detalle.totalPagar.toFixed(2)}</span></p>
            <p><strong>Fecha Generación:</strong> {new Date(detalle.fechaGeneracion).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Cargando detalle...</p>
        )}
      </Modal>

      {/* Modal Generar Nómina */}
      <Modal show={showForm} title="Generar Nueva Nómina" onClose={() => setShowForm(false)}>
        <NominaForm
          onClose={() => setShowForm(false)}
          onSuccess={async () => {
            const nuevas = await nominaService.listar();
            setData(nuevas);
            setShowForm(false);
          }}
        />
      </Modal>
    </MainLayout>
  );
}
