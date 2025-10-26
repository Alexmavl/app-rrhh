import { api } from "../api/client";
import type { Nomina } from "../models/nomina.model";

/**
 * 🔹 Servicio de Nóminas
 * Centraliza todas las peticiones HTTP relacionadas con nómina.
 */
export const nominaService = {
  /** 🧾 Listar todas las nóminas */
  async listar(): Promise<Nomina[]> {
    const res = await api.get("/nominas");
    const data = res.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    console.warn("⚠️ Respuesta inesperada en /nominas:", data);
    return [];
  },

  /** 📄 Obtener una nómina específica por ID */
  async obtenerPorId(id: number): Promise<any> {
    const res = await api.get(`/nominas/${id}`);
    const data = res.data;

    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;

    return data.data || data;
  },

  /** 💰 Crear una nómina manual (empleado individual) */
  async crear(data: Partial<Nomina>) {
    const res = await api.post("/nominas", data);
    return res.data.data ?? res.data;
  },

  /** 🧮 Procesar automáticamente la nómina general (todos los empleados activos) */
  async procesar(data: { periodo: string; fechaInicio: string; fechaFin: string }) {
    const res = await api.post("/nominas/procesar", data);
    return res.data.data ?? res.data;
  },

  /** 🔄 Activar o desactivar una nómina */
  async toggleActivo(id: number) {
    const res = await api.patch(`/nominas/${id}/toggle`);
    return res.data.data ?? res.data;
  },

/** 🧾 Generar voucher (recibo detallado) por empleado */
async obtenerVoucher(idEmpleado: number, periodo: string) {
  // 🔹 Codificar el periodo (ej. "Agosto 2025" → "Agosto%202025")
  const safePeriodo = encodeURIComponent(periodo.trim());
  const res = await api.get(`/nominas/voucher/${idEmpleado}/${safePeriodo}`);

  const data = res.data;

  // ✅ Si la respuesta viene en { success, data: [ { ..., detalle: [...] } ] }
  if (data?.data?.length > 0) {
    const voucher = data.data[0];
    // Si la propiedad "detalle" viene vacía, inicialízala
    voucher.detalle = voucher.detalle ?? [];
    return [voucher];
  }

  // 🔹 Si devuelve directamente un array (fallback)
  if (Array.isArray(data) && data.length > 0) {
    data[0].detalle = data[0].detalle ?? [];
    return data;
  }

  return [];
},

  /** 💵 Registrar beneficio individual (bono o descuento) */
  async registrarBeneficio(data: {
    idEmpleado: number;
    idConcepto: number;
    monto: number;
    tipo: "BONIFICACION" | "DEDUCCION";
    periodo?: string;
  }) {
    const res = await api.post("/nominas/beneficios", data);
    return res.data.data ?? res.data;
  },
};
