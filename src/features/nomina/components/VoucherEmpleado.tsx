import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

interface Props {
  voucher: any;
}

/**
 * 🧾 Componente visual del voucher (recibo de nómina)
 * Muestra desglose de conceptos y permite descargar en PDF.
 */
export const VoucherEmpleado: React.FC<Props> = ({ voucher }) => {
  const voucherRef = useRef<HTMLDivElement>(null);

  if (!voucher) return null;

  // 🔹 Si el SP devuelve un arreglo, tomamos el primer objeto como encabezado
  const encabezado = Array.isArray(voucher) ? voucher[0] : voucher;

  // 🔹 Si el SP devuelve detalle en "detalle" o "conceptos"
  const detalle = encabezado.detalle || encabezado.conceptos || [];

  /** 🧭 Formatear fecha legible */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /** 📄 Descargar PDF */
  const handleDownloadPDF = () => {
    const element = voucherRef.current;
    if (!element) return;

    const opt = {
      margin: 0.3,
      filename: `Voucher_${encabezado.empleado}_${encabezado.periodo}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      {/* Botón de descarga */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
        >
          📄 Descargar PDF
        </button>
      </div>

      {/* Contenido imprimible */}
      <div ref={voucherRef} className="p-4 text-gray-800">
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <img
            src="/image/LogotipoUMG.png"
            alt="Logo"
            className="h-14 object-contain"
          />
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-700">Recibo de Nómina</h2>
            <p className="text-sm text-gray-500">{encabezado.periodo}</p>
          </div>
        </div>

        {/* Datos generales */}
        <div className="grid grid-cols-2 text-sm gap-y-1 mb-4">
          <p>
            <b>Empleado:</b> {encabezado.empleado}
          </p>
          <p>
            <b>Puesto:</b> {encabezado.puesto}
          </p>
          <p>
            <b>Departamento:</b> {encabezado.departamento}
          </p>
          <p>
            <b>Periodo:</b> {encabezado.periodo}
          </p>
          <p>
            <b>Del:</b> {formatDate(encabezado.fechaInicio)}
          </p>
          <p>
            <b>Al:</b> {formatDate(encabezado.fechaFin)}
          </p>
        </div>

        {/* Tabla de conceptos */}
        <table className="w-full border border-gray-300 text-sm mb-6">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border p-2">Concepto</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2 text-right">Monto (Q)</th>
            </tr>
          </thead>
          <tbody>
            {detalle.length > 0 ? (
              detalle.map((d: any, i: number) => (
                <tr key={i}>
                  <td className="border p-2">{d.concepto}</td>
                  <td className="border p-2">{d.tipo}</td>
                  <td
                    className={`border p-2 text-right ${
                      d.tipo === "DEDUCCION" ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {Number(d.monto).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-400">
                  No hay conceptos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totales */}
        <div className="text-right text-sm space-y-1">
          <p>
            <b>Salario Base:</b> Q{encabezado.salarioBase?.toFixed(2)}
          </p>
          <p>
            <b>Total Bonificaciones:</b> Q{encabezado.totalBonificaciones?.toFixed(2)}
          </p>
          <p>
            <b>Total Deducciones:</b> Q{encabezado.totalDescuentos?.toFixed(2)}
          </p>
          <p className="text-lg font-bold text-green-700">
            <b>Total Líquido:</b> Q{encabezado.totalLiquido?.toFixed(2)}
          </p>
        </div>

        {/* Pie de página */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>Este documento es una constancia de pago generada electrónicamente.</p>
          <p>© {new Date().getFullYear()} - Universidad Mariano Gálvez de Guatemala</p>
        </div>
      </div>
    </div>
  );
};
