import React from "react";

interface ModalProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ show, title, onClose, children }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 bg-white border border-gray-200 shadow-xl animate-scaleIn"
      >
        {/* 🧭 Header del modal */}
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
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
        <div className="max-h-[70vh] overflow-y-auto text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};
