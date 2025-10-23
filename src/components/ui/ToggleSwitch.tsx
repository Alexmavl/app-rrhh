import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  color?: "success" | "danger" | "primary";
  label?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  color = "primary",
  label,
}) => {
  const colorClasses = {
    success: checked ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-300",
    danger: checked ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-gray-300",
    primary: checked ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" : "bg-gray-300",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Toggle container */}
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none ${colorClasses[color]}`}
      >
        {/* Knob / circle */}
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      {/* Optional label */}
      {label && (
        <span
          className={`text-sm font-medium select-none ${
            checked ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};
