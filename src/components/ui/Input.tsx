import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  inputSize = "md",
  className = "",
  ...props
}) => {
  /* Determinar si hay error para estilos condicionales */
  const hasError = !!error;

  /* Clases de tamaño */
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2.5 text-sm",
    lg: "px-4 py-3 text-base",
  };

  /* Padding adicional si hay iconos */
  const leftPadding = leftIcon ? "pl-10" : "";
  const rightPadding = rightIcon ? "pr-10" : "";

  /* Estilos del borde según estado */
  const borderStyles = hasError
    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
    : "border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-[#023778]";

  /* Ancho del contenedor */
  const containerWidth = fullWidth ? "w-full" : "";

  return (
    <div className={`flex flex-col gap-1.5 ${containerWidth}`}>
      {/* Etiqueta */}
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-semibold text-gray-700"
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      {/* Contenedor del input con iconos */}
      <div className="relative">
        {/* Icono izquierdo */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Campo de texto */}
        <input
          {...props}
          className={`
            w-full rounded-lg border text-gray-800 placeholder:text-gray-400
            bg-white focus:outline-none transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
            ${sizes[inputSize]}
            ${leftPadding}
            ${rightPadding}
            ${borderStyles}
            ${className}
          `}
        />

        {/* Icono derecho */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Texto de ayuda o error */}
      {error ? (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-xs">⚠</span>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};