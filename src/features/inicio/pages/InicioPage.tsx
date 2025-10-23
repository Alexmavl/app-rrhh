import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { motion } from "framer-motion";

export default function InicioPage() {
  const { user } = useContext(AuthContext)!;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-900 transition-colors">
      {/* 🖼️ Logo */}
      <motion.img
        src="/image/LogotipoUMG.png"
        alt="Logo UMG"
        className="w-40 md:w-48 h-auto mx-auto mb-8 drop-shadow-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
      />

      {/* 👋 Título */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        ¡Bienvenido{user ? `, ${user.nombre}` : ""}!
      </motion.h1>

      {/* 💬 Subtítulo */}
      <motion.p
        className="text-lg text-gray-700 text-center max-w-2xl leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Este es el panel principal del{" "}
        <span className="font-semibold text-blue-600">
          Sistema de Nómina del Departamento de Recursos Humanos
        </span>
        .
      </motion.p>

      {/* ✨ Descripción */}
      <motion.p
        className="text-base text-gray-600 text-center mt-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Gestiona empleados, puestos y nómina de manera eficiente y profesional.
      </motion.p>
    </div>
  );
}
