// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 🔹 Enrutamiento principal */}
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
