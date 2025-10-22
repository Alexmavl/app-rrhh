export const Sidebar = () => (
  <aside className="bg-white shadow-md w-64 min-h-screen p-4 border-r border-gray-200 hidden md:block">
    <ul className="space-y-2">
      <li><a href="/empleados" className="block p-2 rounded hover:bg-blue-100">👤 Empleados</a></li>
      <li><a href="/nomina" className="block p-2 rounded hover:bg-blue-100">💰 Nómina</a></li>
      <li><a href="/reportes" className="block p-2 rounded hover:bg-blue-100">📊 Reportes</a></li>
    </ul>
  </aside>
);
