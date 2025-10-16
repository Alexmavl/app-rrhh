import { useEffect, useState } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";

interface Nomina {
  id: number;
  empleado: string;
  salarioBase: number;
  bonificacion: number;
  total: number;
}

export default function NominaPage() {
  const [nominas, setNominas] = useState<Nomina[]>([]);

  useEffect(() => {
    // Simulación temporal — cambiar por API real
    setNominas([
      { id: 1, empleado: "Ana López", salarioBase: 4000, bonificacion: 250, total: 4250 },
      { id: 2, empleado: "Carlos Pérez", salarioBase: 3800, bonificacion: 250, total: 4050 },
    ]);
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">💰 Nómina</h1>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Listado de Nóminas</h2>
          <Button>Agregar registro</Button>
        </div>

        <Table
          data={nominas}
          columns={[
            { key: "id", label: "ID" },
            { key: "empleado", label: "Empleado" },
            { key: "salarioBase", label: "Salario Base" },
            { key: "bonificacion", label: "Bonificación" },
            { key: "total", label: "Total" },
          ]}
        />
      </Card>
    </MainLayout>
  );
}
