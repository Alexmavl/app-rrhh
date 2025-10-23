import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* 🔹 Etiqueta opcional */}
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* 🔹 Campo de texto */}
      <input
        {...props}
        className={`w-full rounded-lg px-3 py-2 border text-gray-800 placeholder:text-gray-400
          bg-white border-gray-300 focus:outline-none
          focus:ring-2 focus:ring-blue-400 focus:border-blue-400
          disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
      />

      {/* 🔹 Mensaje de error */}
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
