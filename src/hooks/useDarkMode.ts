import { useEffect, useState } from "react";

/**
 * Hook de modo oscuro para TailwindCSS v4
 */
export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    // Verifica si el modo oscuro está guardado en localStorage
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";

    // Si no hay preferencia guardada, usa la del sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Aplica la clase "dark" al <html> global
  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return { dark, setDark };
}
