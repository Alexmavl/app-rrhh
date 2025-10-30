import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import type { ReporteNomina, ReporteDocumentos } from "../../../models/reporte.model";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#fff", fontSize: 11 },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "#003366",
    marginBottom: 8,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 14,
    marginVertical: 8,
    textDecoration: "underline",
    color: "#003366",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eaf0f6",
    borderBottom: "1 solid #999",
    paddingVertical: 5,
  },
  row: { flexDirection: "row", borderBottom: "0.5 solid #ddd", paddingVertical: 4 },
  col1: { width: "35%", paddingLeft: 4 },
  col2: { width: "25%" },
  col3: { width: "20%", textAlign: "center" },
  col4: { width: "20%", textAlign: "right" },
});

export const ReportePDFGlobalDoc: React.FC<{
  nominas: ReporteNomina[];
  documentos: ReporteDocumentos[];
}> = ({ nominas, documentos }) => {
  const fecha = new Date().toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalNominas = nominas.reduce((acc, n) => acc + (n.sueldoLiquido ?? 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
       <Image
  style={{ width: 60, height: 60, alignSelf: "flex-start" }}
  src="/image/LogotipoUMG.png"
/>


        <Text style={styles.title}> Reporte Global de Recursos Humanos</Text>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>{fecha}</Text>

        {/* Sección Nóminas */}
        <Text style={styles.sectionTitle}> Nóminas</Text>
        <Text>
          Total empleados: {nominas.length} | Total general: Q{" "}
          {totalNominas.toLocaleString("es-GT", {
            minimumFractionDigits: 2,
          })}
        </Text>

        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Empleado</Text>
          <Text style={styles.col2}>Departamento</Text>
          <Text style={styles.col3}>Periodo</Text>
          <Text style={styles.col4}>Sueldo (Q)</Text>
        </View>
        {nominas.slice(0, 10).map((n) => (
          <View key={`${n.idEmpleado}-${n.periodo}`} style={styles.row}>
            <Text style={styles.col1}>{n.empleado}</Text>
            <Text style={styles.col2}>{n.departamento}</Text>
            <Text style={styles.col3}>{n.periodo}</Text>
            <Text style={styles.col4}>
              {n.sueldoLiquido?.toLocaleString("es-GT", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        ))}

        {/* Sección Documentos */}
        <Text style={styles.sectionTitle}> Documentos</Text>
        <Text>Total empleados: {documentos.length}</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Empleado</Text>
          <Text style={styles.col2}>Departamento</Text>
          <Text style={styles.col3}>Subidos</Text>
          <Text style={styles.col4}>Aprobados</Text>
        </View>
        {documentos.slice(0, 10).map((d) => (
          <View key={d.idEmpleado} style={styles.row}>
            <Text style={styles.col1}>{d.empleado}</Text>
            <Text style={styles.col2}>{d.departamento}</Text>
            <Text style={styles.col3}>{d.documentosSubidos}</Text>
            <Text style={styles.col4}>{d.documentosAceptados}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export const ReportePDFGlobal: React.FC<{
  nominas: ReporteNomina[];
  documentos: ReporteDocumentos[];
  mostrarDescarga?: boolean;
}> = ({ nominas, documentos, mostrarDescarga = true }) => {
  const doc = <ReportePDFGlobalDoc nominas={nominas} documentos={documentos} />;
  return mostrarDescarga ? (
    <PDFDownloadLink
      document={doc}
      fileName={`reporte_global_RH_${new Date().toISOString().slice(0, 10)}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm"
        >
          {loading ? "Generando..." : "📑 Descargar Reporte Global PDF"}
        </button>
      )}
    </PDFDownloadLink>
  ) : (
    doc
  );
};
