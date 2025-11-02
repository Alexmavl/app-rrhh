export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md border border-gray-200">
        <h1 className="text-6xl font-extrabold text-red-600 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Acceso Denegado</h2>
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta sección del sistema.
        </p>

        <a
          href="/inicio"
          className="inline-block px-6 py-2 bg-[#023778] text-white rounded-lg shadow-md hover:bg-blue-900 transition-all"
        >
          Volver al inicio
        </a>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        <p>
          © 2025 Sistema RRHH — Universidad Mariano Gálvez de Guatemala
        </p>
      </footer>
    </div>
  );
}
