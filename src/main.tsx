import { Buffer } from "buffer";

// 🧩 Extiende la interfaz Window para evitar el error TS2339
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// 👉 Evita el error "Buffer is not defined" en navegador
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
