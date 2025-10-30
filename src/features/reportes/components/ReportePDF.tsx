import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import type { ReporteNomina } from "../../../models/reporte.model";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#fff", fontSize: 11 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "1 solid #ccc",
    paddingBottom: 8,
  },
  logo: { width: 60, height: 60 },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "#003366",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: { fontSize: 12, textAlign: "center", marginBottom: 12 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eaf0f6",
    borderBottom: "1 solid #999",
    paddingVertical: 5,
  },
  row: { flexDirection: "row", borderBottom: "0.5 solid #ddd", paddingVertical: 4 },
  colEmpleado: { width: "28%", paddingLeft: 4 },
  colDepto: { width: "20%" },
  colPeriodo: { width: "15%", textAlign: "center" },
  colBase: { width: "17%", textAlign: "right" },
  colLiquido: {
    width: "20%",
    textAlign: "right",
    fontWeight: "bold",
    color: "#004b23",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#777",
  },
});

const formatQ = (num: number | null | undefined) =>
  `Q ${Number(num || 0).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ReportePDFDoc: React.FC<{ nominas: ReporteNomina[] }> = ({ nominas }) => {
  const fecha = new Date().toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const total = nominas.reduce((acc, n) => acc + (n.sueldoLiquido ?? 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image
  style={{ width: 60, height: 60, alignSelf: "flex-start" }}
  src="/image/LogotipoUMG.png"
/>

          <View>
            <Text>Universidad Mariano Gálvez de Guatemala</Text>
            <Text>Facultad de Ingeniería en Sistemas</Text>
            <Text>{fecha}</Text>
          </View>
        </View>

        <Text style={styles.title}> Reporte Institucional de Nóminas</Text>
        <Text style={styles.subtitle}>
          Total de empleados: {nominas.length} — Total general: {formatQ(total)}
        </Text>

        {/* Tabla */}
        <View style={styles.tableHeader}>
          <Text style={styles.colEmpleado}>Empleado</Text>
          <Text style={styles.colDepto}>Departamento</Text>
          <Text style={styles.colPeriodo}>Periodo</Text>
          <Text style={styles.colBase}>Base (Q)</Text>
          <Text style={styles.colLiquido}>Líquido (Q)</Text>
        </View>

        {nominas.map((n) => (
          <View key={`${n.idEmpleado}-${n.periodo}`} style={styles.row}>
            <Text style={styles.colEmpleado}>{n.empleado}</Text>
            <Text style={styles.colDepto}>{n.departamento}</Text>
            <Text style={styles.colPeriodo}>{n.periodo}</Text>
            <Text style={styles.colBase}>{formatQ(n.salarioBase)}</Text>
            <Text style={styles.colLiquido}>{formatQ(n.sueldoLiquido)}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Sistema de Recursos Humanos — Reporte generado automáticamente.
        </Text>
      </Page>
    </Document>
  );
};

export const ReportePDF: React.FC<{ nominas: ReporteNomina[]; mostrarDescarga?: boolean }> = ({
  nominas,
  mostrarDescarga = true,
}) => {
  const doc = <ReportePDFDoc nominas={nominas} />;
  return mostrarDescarga ? (
    <PDFDownloadLink
      document={doc}
      fileName={`reporte_nominas_${new Date().toISOString().slice(0, 10)}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm"
        >
          {loading ? "Generando PDF..." : "📘 Descargar Nóminas PDF"}
        </button>
      )}
    </PDFDownloadLink>
  ) : (
    doc
  );
};
