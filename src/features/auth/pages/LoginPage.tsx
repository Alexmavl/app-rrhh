import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { login } from "../../../services/auth.service";
import { Modal } from "../../../components/ui/Modal";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  HelpCircle,
  LogIn,
  Briefcase // 👈 Icono de respaldo
} from "lucide-react";

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
    setError,
  } = useForm<LoginInput>();

  const { setUser } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState(false); // 👈 Estado para manejar error de imagen

  const onSubmit = async (data: LoginInput) => {
    try {
      const cleanData = {
        email: data.email.trim().toLowerCase(),
        password: data.password.trim(),
      };

      const res = (await login(cleanData)) as LoginResponse;
      sessionStorage.setItem("token", res.token);
      sessionStorage.setItem("usuario", JSON.stringify(res));
      setUser(res);
      navigate("/inicio", { replace: true });
    } catch (error: any) {
      const mensaje =
        error?.response?.status === 401
          ? "Correo o contraseña incorrectos."
          : error?.response?.data?.message ||
            "Error de conexión o credenciales inválidas.";

      setError("password", { type: "manual", message: mensaje });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        backgroundImage: "url('/image/login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 🎨 Overlay oscuro semitransparente sobre la imagen */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#023778]/85 via-[#023778]/70 to-blue-900/75"
      />

      {/* 🌟 Decoraciones adicionales */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Patrón de puntos sutil */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />
        
        {/* Elementos flotantes sutiles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* 🔹 Contenedor principal */}
      <div className="w-full max-w-md relative z-10">
        {/* 🎯 Card de login */}
        <div className="bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          {/* Header con logo/imagen */}
          <div className="px-8 pt-10 pb-6 text-center relative bg-white/95">
            {/* 🖼️ Logo con fallback mejorado */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {!imageError ? (
                  <>
                    {/* Intenta cargar la imagen */}
                    <img 
                      src="/image/LogotipoUMG.png" 
                      alt="Logo RRHH" 
                      className="w-24 h-24 object-contain rounded-2xl shadow-lg"
                      onError={() => {
                        console.log("❌ Error al cargar imagen: /image/LogotipoUMG.png");
                        setImageError(true);
                      }}
                      onLoad={() => console.log("✅ Imagen cargada correctamente")}
                    />
                    {/* Círculo decorativo detrás */}
                    <div 
                      className="absolute -inset-2 rounded-3xl -z-10 opacity-20 blur-xl"
                      style={{ backgroundColor: "#023778" }}
                    />
                  </>
                ) : (
                  // 👇 Icono de respaldo si la imagen no carga
                  <div 
                    className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#023778" }}
                  >
                    <Briefcase size={48} className="text-yellow-300" />
                  </div>
                )}
              </div>
            </div>

            <h1 
              className="text-2xl md:text-3xl font-bold mb-1"
              style={{ color: "#023778" }}
            >
              Sistema RRHH
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Accede con tus credenciales
            </p>
          </div>

          {/* Separador decorativo */}
          <div className="h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* Formulario */}
          <div className="p-8 bg-white/95">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* 📧 Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="correo@empresa.com"
                    {...register("email", {
                      required: "El correo es obligatorio",
                      setValueAs: (v) => v.trim().toLowerCase(),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Formato de correo inválido",
                      },
                      minLength: {
                        value: 6,
                        message: "El correo es demasiado corto",
                      },
                      maxLength: {
                        value: 100,
                        message: "El correo no puede superar 100 caracteres",
                      },
                    })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 bg-white ${
                      errors.email 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-gray-200 focus:border-[#023778]"
                    } focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder-gray-400`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 🔒 Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Debe tener al menos 6 caracteres",
                      },
                      maxLength: {
                        value: 30,
                        message: "La contraseña no puede superar 30 caracteres",
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/,
                        message:
                          "Debe incluir letras y números (mínimo 6 caracteres)",
                      },
                      setValueAs: (v) => v.trim(),
                    })}
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 bg-white ${
                      errors.password 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-gray-200 focus:border-[#023778]"
                    } focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder-gray-400`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* 🚀 Botón de submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-4 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]"
                style={{ 
                  backgroundColor: "#023778",
                }}
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
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Iniciar sesión</span>
                  </>
                )}
              </button>
            </form>

            {/* 🆘 Enlace de ayuda */}
            <button
              onClick={() => setShowHelp(true)}
              className="w-full mt-5 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-[#023778] transition-colors"
            >
              <HelpCircle size={18} />
              ¿Necesitas ayuda?
            </button>
          </div>

          {/* Footer del card */}
          <div className="px-8 pb-6 bg-white/95">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Sistema RRHH
                <br />
                Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>

        {/* Texto decorativo inferior */}
        <p className="text-center text-white text-sm mt-6 font-semibold drop-shadow-lg">
          Desarrollado por el equipo Grupo No. 1
        </p>
      </div>

      {/* 🧩 Modal de ayuda */}
      <Modal
        show={showHelp}
        onClose={() => setShowHelp(false)}
        title="Soporte de acceso"
        size="sm"
      >
        <div className="space-y-4 text-gray-700">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">
              ¿Problemas para acceder?
            </p>
            <p className="text-sm text-blue-800">
              Contacta al área de Recursos Humanos o envía un correo a:
            </p>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Mail size={20} className="text-[#023778]" />
            <a 
              href="mailto:soporte@empresa.com" 
              className="font-semibold text-[#023778] hover:underline"
            >
              soporte@empresa.com
            </a>
          </div>

          <p className="text-sm text-gray-600">
            También puedes solicitar el restablecimiento de tu contraseña desde
            el portal interno.
          </p>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowHelp(false)}
              className="px-5 py-2.5 rounded-lg font-medium text-white transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: "#023778" }}
            >
              Entendido
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}