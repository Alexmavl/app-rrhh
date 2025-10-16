export const Navbar = () => (
  <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
    <h1 className="font-bold text-lg">Sistema RRHH</h1>
    <div className="flex gap-4">
      <a href="/empleados" className="hover:underline">Empleados</a>
      <a href="/reportes" className="hover:underline">Reportes</a>
    </div>
  </nav>
);
