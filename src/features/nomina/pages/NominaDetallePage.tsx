import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { LoadingSpinner } from "../../../shared/LoadingSpinner";
import { nominaService } from "../../../services/nomina.service";
import { VoucherEmpleado } from "../components/VoucherEmpleado";
import { swalError } from "../../../utils/swalConfig";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


/* Utilidad para formato contable */
const formatQ = (num: number | null | undefined) =>
  `Q${Number(num || 0).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function NominaDetallePage(): React.JSX.Element {
  const { periodo } = useParams<{ periodo: string }>();
  const navigate = useNavigate();

  const [nomina, setNomina] = useState<any[]>([]);
  const [voucher, setVoucher] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** 🔹 Cargar detalle de nómina */
  const fetchNominaDetalle = async () => {
    if (!periodo) return;
    try {
      setIsLoading(true);
      const data = await nominaService.obtenerDetallePorPeriodo(periodo);
      setNomina(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      await swalError("Error", "No se pudo obtener el detalle de la nómina");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominaDetalle();
  }, [periodo]);

  /** 🔹 Totales de nómina */
  const totales = useMemo(() => {
    const sum = (key: string) =>
      nomina.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
    return {
      salarioBase: sum("salarioBase"),
      bonificacion: sum("Bonificacion"),
      incentivo: sum("Incentivo"),
      igss: sum("IGSS"),
      irtra: sum("IRTRA"),
      bonosExtras: sum("Bonos extras"),
      otrosDescuentos: sum("Otros Descuentos"),
      beneficiosEmpleado: sum("Beneficios Empleado"),
      descuentosEmpleado: sum("Descuentos Empleado"),
      totalLiquido: sum("Total Liquido"),
    };
  }, [nomina]);

  /** 🔹 Mostrar voucher */
  const handleVoucher = async (row: any) => {
    try {
      const res = await nominaService.obtenerVoucher(row.idEmpleado, periodo!);
      if (res && res.length > 0) {
        setVoucher(res[0]);
      } else {
        await swalError("Error", "No se encontró voucher para este empleado");
      }
    } catch (err) {
      console.error(err);
      await swalError("Error", "No se pudo generar el voucher");
    }
  };

  const handleCloseVoucher = () => setVoucher(null);

/** Exportar a PDF con diseño profesional y sobrio */
const handleExportPDF = () => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Variables de diseño - Paleta sobria
  const primaryColor: [number, number, number] = [2, 55, 120]; // #023778 - Azul corporativo
  const darkGray: [number, number, number] = [40, 40, 40];
  const mediumGray: [number, number, number] = [100, 100, 100];
  const lightGray: [number, number, number] = [220, 220, 220];
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // =============== ENCABEZADO ===============
  // Logo
  const logo = "/image/LogotipoUMG.png";
  try {
    doc.addImage(logo, "PNG", 14, 10, 30, 22);
  } catch (error) {
    console.error("Error al cargar logo:", error);
  }

  // Título principal
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(48, 10, pageWidth - 62, 22, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("MI APP RRHH", pageWidth / 2, 18, { 
    align: "center" 
  });
  
  doc.setFontSize(14);
  doc.text("Reporte de Nómina de Empleados", pageWidth / 2, 25, { 
    align: "center" 
  });

  // Información del periodo
  doc.setFillColor(250, 250, 250);
  doc.rect(14, 36, pageWidth - 28, 12, "F");
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Periodo: ${decodeURIComponent(periodo || "")}`, 18, 42);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const fecha = new Date().toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Fecha de generación: ${fecha}`, pageWidth - 18, 42, { align: "right" });

  // =============== TABLA DE NÓMINA ===============
  // Inicia directamente después del encabezado
  const tableColumn = [
    "#",
    "Empleado",
    "Puesto",
    "Depto.",
    "Salario Base",
    "Bonif.",
    "Incent.",
    "IGSS",
    "IRTRA",
    "Bonos",
    "Otros Desc.",
    "Total Líquido",
  ];

  const tableRows = nomina.map((row, i) => [
    (i + 1).toString(),
    row.empleado,
    row.puesto,
    row.departamento,
    formatQ(row.salarioBase),
    formatQ(row.Bonificacion),
    formatQ(row.Incentivo),
    formatQ(row.IGSS),
    formatQ(row.IRTRA),
    formatQ(row["Bonos extras"]),
    formatQ(row["Otros Descuentos"]),
    formatQ(row["Total Liquido"]),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 52, // Cambiado de 72 a 52 (elimina espacio de las cards)
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 2,
      valign: "middle",
      halign: "right",
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 8,
    },
    bodyStyles: {
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      1: { halign: "left", cellWidth: 35 },
      2: { halign: "left", cellWidth: 28 },
      3: { halign: "left", cellWidth: 22 },
      4: { halign: "right", cellWidth: 20 },
      5: { halign: "right", cellWidth: 16 },
      6: { halign: "right", cellWidth: 16 },
      7: { halign: "right", cellWidth: 16 },
      8: { halign: "right", cellWidth: 16 },
      9: { halign: "right", cellWidth: 16 },
      10: { halign: "right", cellWidth: 18 },
      11: { halign: "right", cellWidth: 24, fontStyle: "bold" },
    },
  });

  // =============== SECCIÓN DE TOTALES ===============
  const finalY = (doc as any).lastAutoTable.finalY + 8;
  
  // Borde simple sin relleno llamativo
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.rect(14, finalY, pageWidth - 28, 35);
  
  // Título de totales
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RESUMEN GENERAL", pageWidth / 2, finalY + 6, { align: "center" });
  
  // Línea separadora sutil
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(20, finalY + 9, pageWidth - 20, finalY + 9);

  // Columnas de totales
  const col1X = 20;
  const col2X = pageWidth / 2 + 10;
  let yPos = finalY + 15;
  
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  // Columna izquierda
  doc.text("Total Empleados:", col1X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(nomina.length.toString(), col1X + 45, yPos);

  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Total Salario Base:", col1X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatQ(totales.salarioBase), col1X + 45, yPos);

  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Total Bonificaciones:", col1X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatQ(totales.bonificacion), col1X + 45, yPos);

  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Total Incentivos:", col1X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatQ(totales.incentivo), col1X + 45, yPos);

  // Columna derecha
  yPos = finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.text("Total IGSS:", col2X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatQ(totales.igss), col2X + 40, yPos);

  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Total IRTRA:", col2X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatQ(totales.irtra), col2X + 40, yPos);

  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Otros Descuentos:", col2X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatQ(totales.otrosDescuentos), col2X + 40, yPos);

  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Promedio por Empleado:", col2X, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatQ(totales.totalLiquido / nomina.length), col2X + 40, yPos);

  // Total líquido destacado
  const totalBox = finalY + 35;
  doc.setFillColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.roundedRect(pageWidth - 80, totalBox, 66, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL A PAGAR:", pageWidth - 75, totalBox + 6.5);
  doc.setFontSize(12);
  doc.text(formatQ(totales.totalLiquido), pageWidth - 18, totalBox + 6.5, { align: "right" });

  // =============== PIE DE PÁGINA ===============
  doc.setFontSize(7);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Sistema de Gestión de Nómina y RRHH — Proyecto Desarrollo Web 2025 | Universidad Mariano Gálvez de Guatemala",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text(
    `Generado el ${fecha} a las ${new Date().toLocaleTimeString("es-GT")}`,
    pageWidth / 2,
    pageHeight - 5,
    { align: "center" }
  );

  // Línea decorativa inferior
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

  // Guardar PDF
  doc.save(`Nomina_${periodo?.replace(/\s+/g, '_')}.pdf`);
};

/** 🔹 Exportar a Excel */
const handleExportExcel = () => {
  const data = nomina.map((row, i) => ({
    "#": i + 1,
    Empleado: row.empleado,
    Puesto: row.puesto,
    Departamento: row.departamento,
    "Salario Base": row.salarioBase,
    Bonificación: row.Bonificacion,
    Incentivo: row.Incentivo,
    IGSS: row.IGSS,
    IRTRA: row.IRTRA,
    "Bonos Extras": row["Bonos extras"],
    "Otros Desc.": row["Otros Descuentos"],
    "Total Líquido": row["Total Liquido"],
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Detalle Nómina");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Nomina_${periodo}.xlsx`);
};



  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando detalle de nómina..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#023778" }}>
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle de Nómina
              </h1>
              <p className="text-sm text-gray-600">
                Periodo: {decodeURIComponent(periodo || "")}
              </p>
            </div>
          </div>

<Button
  style={{ backgroundColor: "#dc2626", color: "white" }} // rojo
  icon={<FileText size={16} />}
  onClick={handleExportPDF}
>
  Exportar PDF
</Button>

<Button
  style={{ backgroundColor: "#16a34a", color: "white" }} // verde
  icon={<FileText size={16} />}
  onClick={handleExportExcel}
>
  Exportar Excel
</Button>


          <Button
            variant="secondary"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate("/nomina")}
          >
            Volver
          </Button>
        </div>
      </Card>

      {/* Tarjetas de resumen */}
      {nomina.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Empleados</p>
                <p className="text-2xl font-bold text-gray-900">{nomina.length}</p>
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatQ(totales.totalLiquido)}
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio por Empleado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatQ(totales.totalLiquido / nomina.length)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabla de detalle */}
      <Card padding="none">
        {nomina.length > 0 ? (
          <div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-300 text-sm">
  <thead style={{ backgroundColor: "#023778" }} className="text-white">
    <tr>
      <th className="px-3 py-3 text-left">#</th>
      <th className="px-3 py-3 text-left">Empleado</th>
      <th className="px-3 py-3 text-left">Puesto</th>
      <th className="px-3 py-3 text-left">Departamento</th>
      <th className="px-3 py-3 text-right">Salario Base</th>
      <th className="px-3 py-3 text-right">Bonificación</th>
      <th className="px-3 py-3 text-right">Incentivo</th>
      <th className="px-3 py-3 text-right">IGSS</th>
      <th className="px-3 py-3 text-right">IRTRA</th>
      <th className="px-3 py-3 text-right">Bonos Extras</th>
      <th className="px-3 py-3 text-right">Otros Desc.</th>
      <th className="px-3 py-3 text-right">Total Líquido</th>
      <th className="px-3 py-3 text-center">Acciones</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-200 bg-white">
    {nomina.map((row, i) => (
      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
        <td className="px-3 py-3">{i + 1}</td>
        <td className="px-3 py-3 font-medium">{row.empleado}</td>
        <td className="px-3 py-3">{row.puesto}</td>
        <td className="px-3 py-3">{row.departamento}</td>
        <td className="px-3 py-3 text-right">{formatQ(row.salarioBase)}</td>
        <td className="px-3 py-3 text-right">{formatQ(row.Bonificacion)}</td>
        <td className="px-3 py-3 text-right">{formatQ(row.Incentivo)}</td>
        <td className="px-3 py-3 text-right text-red-600">-{formatQ(row.IGSS)}</td>
        <td className="px-3 py-3 text-right text-red-600">-{formatQ(row.IRTRA)}</td>
        <td className="px-3 py-3 text-right text-green-600">
          {formatQ(row["Bonos extras"])}
        </td>
        <td className="px-3 py-3 text-right text-red-600">
          -{formatQ(row["Otros Descuentos"])}
        </td>
        <td className="px-3 py-3 text-right font-bold text-green-700">
          {formatQ(row["Total Liquido"])}
        </td>
        <td className="px-3 py-3 text-center">
          <Button size="sm" variant="info" onClick={() => handleVoucher(row)}>
            <FileText size={14} /> Voucher
          </Button>
        </td>
      </tr>
    ))}
  </tbody>

  <tfoot className="bg-blue-50 font-bold border-t-2" style={{ borderColor: "#023778" }}>
    <tr>
      <td colSpan={4} className="text-right px-3 py-4">TOTALES:</td>
      <td className="text-right px-3 py-4">{formatQ(totales.salarioBase)}</td>
      <td className="text-right px-3 py-4">{formatQ(totales.bonificacion)}</td>
      <td className="text-right px-3 py-4">{formatQ(totales.incentivo)}</td>
      <td className="text-right px-3 py-4 text-red-600">-{formatQ(totales.igss)}</td>
      <td className="text-right px-3 py-4 text-red-600">-{formatQ(totales.irtra)}</td>
      <td className="text-right px-3 py-4 text-green-600">{formatQ(totales.bonosExtras)}</td>
      <td className="text-right px-3 py-4 text-red-600">-{formatQ(totales.otrosDescuentos)}</td>
      <td className="text-right px-3 py-4 text-green-700 text-lg">{formatQ(totales.totalLiquido)}</td>
      <td></td>
    </tr>
  </tfoot>
</table>

          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <FileText size={48} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                No hay registros en esta nómina
              </h3>
              <p className="text-sm text-gray-500">
                No se encontraron empleados para este periodo
              </p>
              <Button
                variant="secondary"
                icon={<ArrowLeft size={18} />}
                onClick={() => navigate("/nomina")}
                className="mt-2"
              >
                Volver a Nóminas
              </Button>
            </div>
          </div>
        )}
      </Card>

    {voucher && <VoucherEmpleado voucher={voucher} />}

   
    </div>
  );
}

export default NominaDetallePage;
