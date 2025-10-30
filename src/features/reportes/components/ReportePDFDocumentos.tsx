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
import type { ReporteDocumentos } from "../../../models/reporte.model";

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
  colEmpleado: { width: "30%", paddingLeft: 4 },
  colDepto: { width: "25%" },
  colReq: { width: "15%", textAlign: "center" },
  colSub: { width: "15%", textAlign: "center" },
  colApr: { width: "15%", textAlign: "center" },
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

const ReportePDFDoc: React.FC<{ reportes: ReporteDocumentos[] }> = ({
  reportes,
}) => {
  const fecha = new Date().toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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

        <Text style={styles.title}> Reporte Institucional de Documentos</Text>
        <Text style={styles.subtitle}>
          Total de empleados: {reportes.length}
        </Text>

        <View style={styles.tableHeader}>
          <Text style={styles.colEmpleado}>Empleado</Text>
          <Text style={styles.colDepto}>Departamento</Text>
          <Text style={styles.colReq}>Requeridos</Text>
          <Text style={styles.colSub}>Subidos</Text>
          <Text style={styles.colApr}>Aprobados</Text>
        </View>

        {reportes.map((r) => (
          <View key={r.idEmpleado} style={styles.row}>
            <Text style={styles.colEmpleado}>{r.empleado}</Text>
            <Text style={styles.colDepto}>{r.departamento}</Text>
            <Text style={styles.colReq}>{r.documentosRequeridos}</Text>
            <Text style={styles.colSub}>{r.documentosSubidos}</Text>
            <Text style={styles.colApr}>{r.documentosAceptados}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Sistema de Recursos Humanos — Reporte generado automáticamente.
        </Text>
      </Page>
    </Document>
  );
};

export const ReportePDFDocumentos: React.FC<{
  reportes: ReporteDocumentos[];
  mostrarDescarga?: boolean;
}> = ({ reportes, mostrarDescarga = true }) => {
  const doc = <ReportePDFDoc reportes={reportes} />;
  return mostrarDescarga ? (
    <PDFDownloadLink
      document={doc}
      fileName={`reporte_documentos_${new Date().toISOString().slice(0, 10)}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm"
        >
          {loading ? "Generando PDF..." : "📄 Descargar Documentos PDF"}
        </button>
      )}
    </PDFDownloadLink>
  ) : (
    doc
  );
};
