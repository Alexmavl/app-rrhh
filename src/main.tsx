import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthProvider";

// Crea una instancia de React Query Client
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