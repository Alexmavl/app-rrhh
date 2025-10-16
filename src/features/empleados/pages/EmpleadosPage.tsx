import { useEffect, useState } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";
import { EmpleadosService } from "../../../services/empleados.service.ts";
import type { Empleado } from "../../../models/empleado.model.ts";

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  useEffect(() => {
    EmpleadosService.listar().then(setEmpleados);
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Gestión de Empleados</h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Listado</h2>
          <Button>Nuevo Empleado</Button>
        </div>
        <Table
          data={empleados}
          columns={[
            { key: "id", label: "ID" },
            { key: "nombre", label: "Nombre" },
            { key: "puesto", label: "Puesto" },
            { key: "salario", label: "Salario" },
          ]}
        />
      </Card>
    </MainLayout>
  );
}
