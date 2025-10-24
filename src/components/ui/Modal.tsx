import React from "react";

interface ModalProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  /** ✅ Tamaños disponibles */
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  show,
  title,
  onClose,
  children,
  size = "md",
}) => {
  if (!show) return null;

  // 📏 Clases según tamaño
  const sizeClasses = {
    sm: "max-w-md", // 480px
    md: "max-w-2xl", // 768px
    lg: "max-w-4xl", // 1024px
    xl: "max-w-6xl", // 1280px
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${sizeClasses[size]} rounded-2xl p-6 bg-white border border-gray-200 shadow-xl animate-scaleIn`}
      >
        {/* 🧭 Header del modal */}
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* 🧱 Contenido */}
        <div className="max-h-[75vh] overflow-y-auto text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};
