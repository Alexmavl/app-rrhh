import React from "react";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  striped?: boolean;
}

export function Table<T>({ data, columns, striped = true }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left border-collapse bg-white text-gray-800 transition-colors">
        {/* 🧭 Encabezado */}
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 font-semibold uppercase tracking-wide text-xs"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* 🧱 Cuerpo */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-3 text-center text-gray-500 italic"
              >
                No hay registros disponibles.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={`${
                  striped
                    ? i % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white"
                    : "bg-white"
                } hover:bg-blue-50 transition-colors`}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  const content: React.ReactNode =
                    React.isValidElement(value)
                      ? value
                      : typeof value === "string" ||
                        typeof value === "number" ||
                        typeof value === "boolean"
                      ? String(value)
                      : "";

                  return (
                    <td
                      key={String(col.key)}
                      className="px-4 py-2 border-t border-gray-200 text-sm"
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
