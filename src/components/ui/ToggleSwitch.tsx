import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: "success" | "danger" | "primary" | "warning" | "info";
  label?: string;
  labelPosition?: "left" | "right";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  name?: string;
  id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  color = "primary",
  label,
  labelPosition = "right",
  disabled = false,
  size = "md",
  name,
  id,
}) => {
  /* Tamaños del toggle */
  const sizes = {
    sm: {
      container: "h-5 w-9",
      knob: "h-3.5 w-3.5",
      translate: checked ? "translate-x-4" : "translate-x-0.5",
    },
    md: {
      container: "h-6 w-11",
      knob: "h-5 w-5",
      translate: checked ? "translate-x-5" : "translate-x-0.5",
    },
    lg: {
      container: "h-7 w-14",
      knob: "h-6 w-6",
      translate: checked ? "translate-x-7" : "translate-x-0.5",
    },
  };

  /* Colores según estado */
  const getColorClasses = () => {
    if (disabled) {
      return checked ? "bg-gray-400" : "bg-gray-300";
    }

    const colors = {
      success: checked ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-300",
      danger: checked ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-gray-300",
      primary: checked ? "shadow-[0_0_8px_rgba(2,55,120,0.5)]" : "bg-gray-300",
      warning: checked ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "bg-gray-300",
      info: checked ? "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" : "bg-gray-300",
    };

    return colors[color];
  };

  /* Estilo inline para primary con color personalizado */
  const primaryStyle =
    color === "primary" && checked && !disabled
      ? { backgroundColor: "#023778" }
      : undefined;

  /* Manejador de cambio */
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  /* Cursor según estado disabled */
  const cursorClass = disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer";

  /* Label clickeable */
  const labelCursorClass = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <div className={`flex items-center ${labelPosition === "left" ? "flex-row-reverse" : "flex-row"} gap-2`}>
      {/* Toggle container */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || "Toggle"}
        onClick={handleToggle}
        disabled={disabled}
        name={name}
        id={id}
        className={`
          relative inline-flex items-center rounded-full 
          transition-all duration-300 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
          ${sizes[size].container}
          ${getColorClasses()}
          ${cursorClass}
        `}
        style={primaryStyle}
      >
        {/* Knob / circle */}
        <span
          className={`
            inline-block rounded-full bg-white shadow-md 
            transition-all duration-300 ease-in-out
            ${sizes[size].knob}
            ${sizes[size].translate}
          `}
        />
      </button>

      {/* Optional label */}
      {label && (
        <label
          htmlFor={id}
          onClick={handleToggle}
          className={`
            text-sm font-medium select-none transition-colors
            ${checked ? "text-gray-800" : "text-gray-500"}
            ${disabled ? "opacity-50" : ""}
            ${labelCursorClass}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};