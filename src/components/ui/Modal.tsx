import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  show,
  title,
  onClose,
  children,
  size = "md",
  footer,
  closeOnOverlayClick = true,
  showCloseButton = true,
  centered = true,
}) => {
  /* Bloquear scroll del body cuando el modal está abierto */
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  /* Cerrar con tecla ESC */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [show, onClose]);

  if (!show) return null;

  /* Clases según tamaño */
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  /* Alineación vertical */
  const alignmentClass = centered ? "items-center" : "items-start pt-20";

  /* Manejar clic en overlay */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${alignmentClass} justify-center bg-black/50 backdrop-blur-sm animate-fadeIn px-4 py-6 overflow-y-auto`}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div
        className={`w-full ${sizeClasses[size]} rounded-2xl bg-white border border-gray-200 shadow-2xl animate-scaleIn my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Contenido */}
        <div className="px-6 py-4 max-h-[calc(85vh-200px)] overflow-y-auto text-gray-800">
          {children}
        </div>

        {/* Footer opcional */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};