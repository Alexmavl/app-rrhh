import { useState, useEffect } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";

interface Reporte {
  id: number;
  titulo: string;
  fecha: string;
  tipo: string;
}

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);

  useEffect(() => {
    // Simulación de API — sustituye con llamada real
    setReportes([
      { id: 1, titulo: "Empleados Activos", fecha: "2025-10-15", tipo: "General" },
      { id: 2, titulo: "Nómina Septiembre", fecha: "2025-10-01", tipo: "Financiero" },
    ]);
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">📊 Reportes</h1>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Listado de reportes</h2>
          <Button>Generar nuevo</Button>
        </div>

        <Table
          data={reportes}
          columns={[
            { key: "id", label: "ID" },
            { key: "titulo", label: "Título" },
            { key: "fecha", label: "Fecha" },
            { key: "tipo", label: "Tipo" },
          ]}
        />
      </Card>
    </MainLayout>
  );
}
