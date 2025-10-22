// src/features/auth/pages/LoginPage.tsx
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { login } from "../../../services/usuarios.service"; // ✅ debe coincidir con tu servicio real

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<LoginInput>();
  const { setUser } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const onSubmit = async (data: LoginInput) => {
    try {
      // 🔐 Petición al backend
      const res = (await login(data.email, data.password)) as LoginResponse;

      // 🧠 Guarda sesión
      sessionStorage.setItem("token", res.token);
      sessionStorage.setItem("usuario", JSON.stringify(res));

      // 🧩 Actualiza contexto global
      setUser(res);

      // 🚀 Redirige al dashboard principal
      navigate("/empleados", { replace: true });
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);
      if (error instanceof Error) {
        alert(`❌ Error al iniciar sesión: ${error.message}`);
      } else {
        alert("❌ Error desconocido al iniciar sesión");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Iniciar Sesión
        </h2>

        <input
          {...register("email", { required: "El correo es obligatorio" })}
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          {...register("password", { required: "La contraseña es obligatoria" })}
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition disabled:opacity-60"
        >
          {formState.isSubmitting ? "Iniciando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
