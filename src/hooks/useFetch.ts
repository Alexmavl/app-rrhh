import { useEffect, useState } from "react";
import { api } from "../api/client";

/**
 * Hook genérico para cargar datos desde la API.
 * @param url Endpoint (por ejemplo "/empleados")
 * @param deps Dependencias opcionales para recargar datos
 */
export function useFetch<T>(url: string, deps: any[] = [], initialValue?: T) {
  const [data, setData] = useState<T>(initialValue as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .get(url)
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .catch((err) => {
        console.error("❌ useFetch error:", err);
        if (mounted)
          setError(err.response?.data?.message || err.message || "Error al cargar datos");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error, setData };
}
