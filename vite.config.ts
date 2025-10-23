import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

//  Configuración base con alias para imports limpios
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@features": path.resolve(__dirname, "src/features"),
      "@components": path.resolve(__dirname, "src/components"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@models": path.resolve(__dirname, "src/models"),
    },
  },
});
