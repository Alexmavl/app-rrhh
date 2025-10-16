interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];
}

export function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden">
      <thead className="bg-blue-600 text-white">
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="px-4 py-2 text-left text-sm font-semibold">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="odd:bg-gray-50 even:bg-white hover:bg-blue-50">
            {columns.map((col) => (
              <td key={String(col.key)} className="px-4 py-2 text-sm text-gray-800">
                {String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
