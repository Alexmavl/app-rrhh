import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { login } from "../../../services/auth.service";
import { Modal } from "../../../components/ui/Modal"; // ✅ Importar modal mejorado

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  const { setUser } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false); // ✅ Estado del modal de ayuda

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = (await login(data)) as LoginResponse;
      sessionStorage.setItem("token", res.token);
      sessionStorage.setItem("usuario", JSON.stringify(res));
      setUser(res);
      navigate("/inicio", { replace: true });
    } catch (error: any) {
      alert(error.message || "Credenciales inválidas o error de conexión.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-1">
            Sistema RRHH
          </h1>
          <p className="text-gray-600">Accede con tus credenciales</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo inválido",
                },
              })}
              placeholder="correo@empresa.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 4,
                  message: "Mínimo 4 caracteres",
                },
              })}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Enlace de ayuda */}
        <p className="text-center text-sm text-blue-600 mt-4 cursor-pointer hover:underline" onClick={() => setShowHelp(true)}>
          ¿Necesitas ayuda?
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Recursos Humanos · Todos los derechos reservados
        </p>
      </div>

      {/* 🧩 Modal corporativo de ayuda */}
      <Modal show={showHelp} onClose={() => setShowHelp(false)} title="Soporte de acceso" size="sm">
        <div className="space-y-3 text-gray-700">
          <p>Si tienes problemas para acceder al sistema, contacta al área de Recursos Humanos o envía un correo a:</p>
          <p className="font-semibold text-blue-600">soporte@empresa.com</p>
          <p className="text-sm text-gray-500 mt-2">
            También puedes solicitar el restablecimiento de tu contraseña desde el portal interno.
          </p>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowHelp(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
