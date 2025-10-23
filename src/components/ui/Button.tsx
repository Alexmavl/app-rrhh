import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    /** 🔵 Acción principal */
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400",

    /** ⚪ Secundario / neutro */
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 focus:ring-gray-400",

    /** 🟢 Éxito */
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400",

    /** 🟡 Advertencia / Precaución */
    warning:
      "bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-400",

    /** 🟥 Peligro */
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
