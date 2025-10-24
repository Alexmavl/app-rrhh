import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "filled";
  hoverable?: boolean;
  clickable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  className = "",
  variant = "default",
  hoverable = false,
  clickable = false,
  padding = "md",
  header,
  footer,
  title,
  subtitle,
  ...props
}) => {
  /* Base de estilos */
  const base = "rounded-xl transition-all duration-200";

  /* Variantes */
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    outlined: "bg-white border-2 border-gray-300",
    elevated: "bg-white border border-gray-200 shadow-lg",
    filled: "border border-gray-200 shadow-sm",
  };

  /* Variante filled usa color personalizado */
  const filledStyle = variant === "filled" 
    ? { backgroundColor: "#023778", color: "white" } 
    : undefined;

  /* Hover opcional */
  const hoverClass = hoverable ? "hover:shadow-xl hover:-translate-y-1" : "";

  /* Clickable opcional */
  const clickableClass = clickable ? "cursor-pointer hover:border-blue-400" : "";

  /* Padding */
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  /* Padding del contenido si hay header/footer */
  const contentPadding = header || footer ? "" : paddings[padding];

  return (
    <div
      className={`${base} ${variants[variant]} ${hoverClass} ${clickableClass} ${
        !header && !footer ? paddings[padding] : ""
      } ${className}`}
      style={filledStyle}
      {...props}
    >
      {/* Header opcional */}
      {header && (
        <div className={`border-b ${variant === "filled" ? "border-white/20" : "border-gray-200"} ${paddings[padding]} pb-3`}>
          {header}
        </div>
      )}

      {/* Header con title/subtitle */}
      {(title || subtitle) && !header && (
        <div className={`border-b ${variant === "filled" ? "border-white/20" : "border-gray-200"} ${paddings[padding]} pb-3`}>
          {title && (
            <h3 className={`text-lg font-semibold ${variant === "filled" ? "text-white" : "text-gray-900"}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-sm mt-1 ${variant === "filled" ? "text-white/80" : "text-gray-500"}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className={contentPadding || paddings[padding]}>
        {children}
      </div>

      {/* Footer opcional */}
      {footer && (
        <div className={`border-t ${variant === "filled" ? "border-white/20" : "border-gray-200"} ${paddings[padding]} pt-3 mt-3`}>
          {footer}
        </div>
      )}
    </div>
  );
};