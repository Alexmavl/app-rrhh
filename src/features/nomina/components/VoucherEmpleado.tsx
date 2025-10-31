import React, { useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import Swal from "sweetalert2";

/* ---------- UTILIDADES ---------- */
const formatDate = (dateValue?: any): string => {
  if (!dateValue) return "—";
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const formatQ = (num: any): string => {
  const value = Number(num);
  if (isNaN(value)) return "Q0.00";
  return `Q${value.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/* ---------- PLANTILLA PDF ---------- */
const VoucherPDF = ({ voucher }: { voucher: any }) => {
  const encabezado = Array.isArray(voucher) ? voucher[0] : voucher;
  const detalle = encabezado.detalle || encabezado.conceptos || [];

  const styles = StyleSheet.create({
    page: {
      padding: 25,
      fontSize: 8,
      fontFamily: "Helvetica",
      backgroundColor: "#fff",
      height: "50%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1.5,
      borderBottomColor: "#023778",
      paddingBottom: 6,
      marginBottom: 10,
    },
    logo: { width: 60, height: 45, objectFit: "contain" },
    titleBox: { textAlign: "right" },
    title: { fontSize: 14, fontWeight: "bold", color: "#023778" },
    subtitle: { fontSize: 8, color: "#666" },
    sectionTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#023778",
      marginBottom: 6,
      borderLeftWidth: 3,
      borderLeftColor: "#023778",
      paddingLeft: 4,
    },
    grid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
    gridItem: { width: "50%", marginBottom: 4 },
    label: { fontSize: 7, color: "#666" },
    value: { fontSize: 8.5, fontWeight: "bold", color: "#111" },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#023778",
      color: "#FFF",
      padding: 4,
      borderRadius: 2,
    },
    tableRow: {
      flexDirection: "row",
      padding: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: "#EEE",
    },
    cell: { flex: 1, fontSize: 7 },
    cellRight: { flex: 1, fontSize: 7, textAlign: "right" },
    totals: {
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#CCC",
      paddingTop: 4,
    },
    totalLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 1.5,
    },
    totalBold: { fontWeight: "bold", fontSize: 8.5, color: "#023778" },
    footer: {
      textAlign: "center",
      fontSize: 6.5,
      color: "#777",
      marginTop: 10,
      borderTopWidth: 0.5,
      borderTopColor: "#CCC",
      paddingTop: 4,
    },
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image src="/image/LogotipoUMG.png" style={styles.logo} />
          <View style={styles.titleBox}>
            <Text style={styles.title}>Recibo de Nómina</Text>
            <Text style={styles.subtitle}>{encabezado.periodo || "—"}</Text>
          </View>
        </View>

        {/* Información del empleado */}
        <Text style={styles.sectionTitle}>Información del Empleado</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Empleado</Text>
            <Text style={styles.value}>{encabezado.empleado || "—"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Puesto</Text>
            <Text style={styles.value}>{encabezado.puesto || "—"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Departamento</Text>
            <Text style={styles.value}>{encabezado.departamento || "—"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Periodo</Text>
            <Text style={styles.value}>{encabezado.periodo || "—"}</Text>
          </View>
        </View>

        {/* Detalle */}
        <Text style={styles.sectionTitle}>Detalle de Conceptos</Text>
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.cell}>Concepto</Text>
            <Text style={styles.cell}>Tipo</Text>
            <Text style={styles.cellRight}>Monto</Text>
          </View>

          {detalle.length > 0 ? (
            detalle.map((d: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{d.concepto || "—"}</Text>

                {/* ✅ Muestra tipo con color según su valor */}
                <Text
                  style={{
                    ...styles.cell,
                    color:
                      (d.tipoConcepto || d.tipo || "").toUpperCase() ===
                      "BONIFICACION"
                        ? "#007F0E"
                        : (d.tipoConcepto || d.tipo || "").toUpperCase() ===
                          "DEDUCCION"
                        ? "#C30000"
                        : "#000",
                  }}
                >
                  {d.tipoConcepto || d.tipo || "—"}
                </Text>

                <Text
                  style={{
                    ...styles.cellRight,
                    color:
                      (d.tipoConcepto || d.tipo || "").toUpperCase() ===
                      "BONIFICACION"
                        ? "#007F0E"
                        : (d.tipoConcepto || d.tipo || "").toUpperCase() ===
                          "DEDUCCION"
                        ? "#C30000"
                        : "#000",
                  }}
                >
                  {formatQ(d.monto)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: "#999", marginTop: 4 }}>
              No hay conceptos registrados
            </Text>
          )}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalLine}>
            <Text>Salario Base:</Text>
            <Text>{formatQ(encabezado.salarioBase)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text>Bonificaciones:</Text>
            <Text>+{formatQ(encabezado.totalBonificaciones)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text>Deducciones:</Text>
            <Text>-{formatQ(encabezado.totalDescuentos)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalBold}>Total Líquido:</Text>
            <Text style={styles.totalBold}>
              {formatQ(encabezado.totalLiquido)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Documento generado electrónicamente</Text>
          <Text>© {new Date().getFullYear()} Universidad Mariano Gálvez</Text>
        </View>
      </Page>
    </Document>
  );
};

/* ---------- COMPONENTE PRINCIPAL ---------- */
export const VoucherEmpleado = ({ voucher }: { voucher: any }) => {
  useEffect(() => {
    const generarPDF = async () => {
      Swal.fire({
        title: "Generando PDF...",
        text: "Por favor espera un momento",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const blob = await pdf(<VoucherPDF voucher={voucher} />).toBlob();
        const url = URL.createObjectURL(blob);

        const encabezado = Array.isArray(voucher) ? voucher[0] : voucher;
        const nombreArchivo = `Voucher_${encabezado.empleado
          ?.replace(/\s+/g, "_")
          .trim() || "empleado"}_${encabezado.periodo
          ?.replace(/\s+/g, "_")
          .trim() || "periodo"}.pdf`;

        Swal.fire({
          title: "Voucher generado",
          html: `
            <p style="margin-bottom: 10px; color: #555;">
              Tu comprobante está listo para descargar.
            </p>
            <a href="${url}" download="${nombreArchivo}"
               style="display:inline-block; background:#023778; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:600;">
               📄 Descargar PDF
            </a>
          `,
          icon: "success",
          showConfirmButton: false,
          timer: 25000,
        });
      } catch (error) {
        console.error("Error al generar PDF:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo generar el PDF. Intenta nuevamente.",
          icon: "error",
        });
      }
    };

    generarPDF();
  }, [voucher]);

  return null; // No renderiza nada visualmente
};
