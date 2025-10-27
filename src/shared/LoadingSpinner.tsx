import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "primary",
  text,
  fullScreen = false,
  className = "",
}) => {
  /* Tamaños del spinner */
  const sizes = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  /* Grosor del borde según tamaño */
  const borderWidth = {
    sm: "border-2",
    md: "border-4",
    lg: "border-[5px]",
    xl: "border-[6px]",
  };

  /* Variantes de color */
  const variants = {
    primary: {
      outer: "border-transparent",
      inner: "border-gray-200",
    },
    secondary: {
      outer: "border-gray-300 border-t-transparent",
      inner: "border-gray-100 border-t-transparent",
    },
    white: {
      outer: "border-white/30 border-t-transparent",
      inner: "border-white/10 border-t-transparent",
    },
  };

  /* Estilo inline para primary */
  const primaryOuterStyle = variant === "primary" 
    ? { borderTopColor: "#023778", borderRightColor: "#023778", borderBottomColor: "#023778" }
    : undefined;

  /* Contenedor según si es fullScreen */
  const containerClass = fullScreen
    ? "fixed inset-0 z-50 flex flex-col justify-center items-center bg-white/80 backdrop-blur-sm"
    : "flex flex-col justify-center items-center py-10";

  /* Tamaño del texto según tamaño del spinner */
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        {/* Spinner exterior */}
        <div
          className={`absolute inset-0 ${borderWidth[size]} ${variants[variant].outer} rounded-full animate-spin`}
          style={primaryOuterStyle}
        />
        {/* Spinner interior */}
        <div
          className={`absolute inset-1 ${borderWidth[size]} ${variants[variant].inner} rounded-full animate-spin-slow`}
        />
      </div>

      {/* Texto opcional */}
      {text && (
        <p className={`mt-4 ${textSize[size]} font-medium text-gray-600 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};