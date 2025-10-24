import React from "react";

interface TableProps<T> {
  data: T[];
  columns: { 
    key: keyof T; 
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    width?: string;
    align?: "left" | "center" | "right";
  }[];
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  compact?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
}

export function Table<T>({ 
  data, 
  columns, 
  striped = true,
  hover = true,
  bordered = false,
  compact = false,
  loading = false,
  emptyMessage = "No hay registros disponibles",
  onRowClick,
}: TableProps<T>) {
  
  /* Estilos de padding según si es compacto */
  const cellPadding = compact ? "px-3 py-2" : "px-4 py-3";
  const headerPadding = compact ? "px-3 py-2" : "px-4 py-3";

  /* Cursor si las filas son clickeables */
  const rowCursor = onRowClick ? "cursor-pointer" : "";

  /* Hover effect */
  const hoverEffect = hover ? "hover:bg-blue-50" : "";

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left border-collapse bg-white text-gray-800">
        {/* Encabezado */}
        <thead style={{ backgroundColor: "#023778" }} className="text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`${headerPadding} font-semibold uppercase tracking-wide text-xs`}
                style={{ 
                  width: col.width,
                  textAlign: col.align || "left"
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Cuerpo */}
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`${cellPadding} text-center`}
              >
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  <span>Cargando...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`${cellPadding} text-center text-gray-500`}
              >
                <div className="py-8">
                  <p className="text-gray-400 text-base">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row, i)}
                className={`
                  ${striped ? (i % 2 === 0 ? "bg-gray-50" : "bg-white") : "bg-white"}
                  ${hoverEffect}
                  ${rowCursor}
                  transition-colors
                  ${bordered ? "border-b border-gray-200" : ""}
                `}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  
                  /* Si hay función render personalizada, usarla */
                  const content: React.ReactNode = col.render
                    ? col.render(value, row)
                    : React.isValidElement(value)
                    ? value
                    : typeof value === "string" ||
                      typeof value === "number" ||
                      typeof value === "boolean"
                    ? String(value)
                    : value === null || value === undefined
                    ? "-"
                    : "";

                  return (
                    <td
                      key={String(col.key)}
                      className={`${cellPadding} border-t border-gray-200`}
                      style={{ textAlign: col.align || "left" }}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}