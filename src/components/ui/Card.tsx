import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  hoverable?: boolean;
}

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  className = "",
  variant = "default",
  hoverable = true,
  ...props
}) => {
  // 💡 Base: estilo común para todas las tarjetas
  const base =
    "rounded-xl p-4 bg-white border border-gray-200 text-gray-800 transition-all duration-200";

  // 🎨 Variantes
  const variants = {
    default: "",
    outlined: "border-2 border-gray-300 bg-transparent",
    elevated: "shadow-md",
  };

  // 🖱️ Hover opcional
  const hover = hoverable ? "hover:shadow-lg" : "shadow-none";

  return (
    <div
      className={`${base} ${variants[variant]} ${hover} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
