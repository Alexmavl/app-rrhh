import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { nominaService } from "../../../services/nomina.service";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import type { Nomina } from "../../../models/nomina.model";

export default function NominaPage() {
  const { user } = useContext(AuthContext)!;
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    nominaService
      .listar()
      .then(setNominas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando nóminas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // ✅ Agrupar por periodo
  const grupos = agruparPorPeriodo(nominas);

  function agruparPorPeriodo(nominas: Nomina[]) {
    const grupos: Record<string, Nomina[]> = {};
    for (const n of nominas) {
      if (!grupos[n.periodo]) grupos[n.periodo] = [];
      grupos[n.periodo].push(n);
    }
    return grupos;
  }

  const periodos = Object.keys(grupos);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">💰 Nómina por Periodo</h1>

      <Card>
        <Table
          columns={[
            { key: "periodo" as any, label: "Periodo" },
            { key: "tipoPeriodo" as any, label: "Tipo" },
            { key: "fechaInicio" as any, label: "Inicio" },
            { key: "fechaFin" as any, label: "Fin" },
            { key: "total" as any, label: "Total a Pagar (Q)" },
          ]}
          data={periodos.map((periodo) => {
            const lista = grupos[periodo];
            const total = lista.reduce((acc, n) => acc + (n.totalLiquido ?? 0), 0);
            return {
              periodo,
              tipoPeriodo: lista[0]?.tipoPeriodo || "—",
              fechaInicio: new Date(lista[0]?.fechaInicio ?? "").toLocaleDateString(),
              fechaFin: new Date(lista[0]?.fechaFin ?? "").toLocaleDateString(),
              total: total.toFixed(2),
            };
          })}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {periodos.map((p) => (
            <Button key={p} variant="secondary" onClick={() => setPeriodoSeleccionado(p)}>
              👁️ Ver {p}
            </Button>
          ))}
        </div>
      </Card>

      {/* Modal con detalle por periodo */}
      <Modal
        show={!!periodoSeleccionado}
        title={`Detalle de Nómina - ${periodoSeleccionado}`}
        onClose={() => setPeriodoSeleccionado(null)}
      >
        {periodoSeleccionado ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-2 text-left">Empleado</th>
                  <th className="p-2 text-left">Departamento</th>
                  <th className="p-2 text-left">Puesto</th>
                  <th className="p-2 text-left">Salario Base</th>
                  <th className="p-2 text-left">Total Líquido</th>
                </tr>
              </thead>
              <tbody>
                {grupos[periodoSeleccionado].map((n) => (
                  <tr key={n.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{n.empleado}</td>
                    <td className="p-2">{n.departamento}</td>
                    <td className="p-2">{n.puesto}</td>
                    <td className="p-2">Q{n.salarioBase.toFixed(2)}</td>
                    <td className="p-2 text-green-600 font-semibold">
                      Q{n.totalLiquido?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Selecciona un periodo.</p>
        )}
      </Modal>
    </div>
  );
}
