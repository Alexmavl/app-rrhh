import { api } from "../api/client";
import type { Nomina } from "../models/nomina.model";

/**
 *  Servicio de Nóminas
 * Centraliza todas las peticiones HTTP relacionadas con nómina.
 */
export const nominaService = {
  /** Listar nóminas agrupadas por periodo */
  async listarResumen(): Promise<any[]> {
    const res = await api.get("/nominas/resumen");
    return res.data?.data ?? [];
  },

  /**  Obtener detalle (empleados) de una nómina por periodo */
  async obtenerDetallePorPeriodo(periodo: string): Promise<any[]> {
    const safePeriodo = encodeURIComponent(periodo.trim());
    const res = await api.get(`/nominas/detalle/${safePeriodo}`);
    return res.data?.data ?? [];
  },

  /** Obtener totales globales de una nómina por periodo */
  async obtenerResumenPorPeriodo(periodo: string): Promise<any | null> {
    const safePeriodo = encodeURIComponent(periodo.trim());
    const res = await api.get(`/nominas/resumen-por-periodo/${safePeriodo}`);
    if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
      return res.data.data[0];
    }
    return res.data?.data ?? null;
  },

  /** Obtener conceptos (bonificaciones/deducciones) por periodo */
  async obtenerConceptosPorPeriodo(periodo: string): Promise<any[]> {
    const safePeriodo = encodeURIComponent(periodo.trim());
    const res = await api.get(`/nominas/conceptos/${safePeriodo}`);
    return res.data?.data ?? [];
  },

  /** Listar todas las nóminas (individuales) */
  async listar(): Promise<Nomina[]> {
    const res = await api.get("/nominas");
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    console.warn("⚠️ Respuesta inesperada en /nominas:", data);
    return [];
  },

  /**  Obtener una nómina específica por ID */
  async obtenerPorId(id: number): Promise<any> {
    const res = await api.get(`/nominas/${id}`);
    const data = res.data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    return data.data || data;
  },

  /**  Crear una nómina manual (empleado individual) */
  async crear(data: Partial<Nomina>) {
    const res = await api.post("/nominas", data);
    return res.data.data ?? res.data;
  },

  /**  Procesar automáticamente la nómina general (todos los empleados activos) */
  async procesar(data: { periodo: string; fechaInicio: string; fechaFin: string }) {
    const res = await api.post("/nominas/procesar", data);
    return res.data.data ?? res.data;
  },

  /** Activar o desactivar una nómina */
  async toggleActivo(id: number) {
    const res = await api.patch(`/nominas/${id}/toggle`);
    return res.data.data ?? res.data;
  },

   /** 🧾 Obtener voucher detallado de un empleado por periodo */
  async obtenerVoucher(idEmpleado: number, periodo: string) {
    const encodedPeriodo = encodeURIComponent(periodo.trim());
    const res = await api.get(`/nominas/voucher/${idEmpleado}/${encodedPeriodo}`);
    const data = res.data;

    if (data?.data?.length > 0) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  },
  /**  Registrar beneficio individual (bono o descuento) */
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
