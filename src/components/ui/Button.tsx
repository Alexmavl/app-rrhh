import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  children,
  disabled,
  ...props
}) => {
  const base =
    "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";

  /* Tamaños predefinidos */
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-6 py-3",
  };

  /* Variantes de color - Primary usa #023778 */
  const variants = {
    primary: "text-white focus:ring-blue-400 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 focus:ring-gray-400",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400 shadow-sm hover:shadow-md",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-400 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 shadow-sm hover:shadow-md",
    info: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400 shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400",
  };

  /* Ancho completo opcional */
  const widthClass = fullWidth ? "w-full" : "";

  /* Estilo inline para primary con color personalizado */
  const primaryStyle =
    variant === "primary" && !disabled && !loading
      ? { backgroundColor: "#023778" }
      : variant === "primary" && (disabled || loading)
      ? { backgroundColor: "#023778" }
      : undefined;

  /* Hover para primary */
  const primaryHoverClass =
    variant === "primary"
      ? "hover:brightness-110 active:brightness-95"
      : "";

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${widthClass} ${primaryHoverClass} ${className}`}
      disabled={disabled || loading}
      style={primaryStyle}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icono a la izquierda */}
      {!loading && icon && iconPosition === "left" && icon}

      {/* Contenido del botón */}
      {children}

      {/* Icono a la derecha */}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};