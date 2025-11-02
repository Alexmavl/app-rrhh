import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import type { UsuarioFormData } from "../components/UsuarioForm";
import {
  getUsuarios,
  getRoles,
  createUsuario,
  updateUsuario,
  toggleUsuarioActivo,
} from "../services/usuarios.service";
import { Usuario, Rol } from "../models/usuario.model";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Modal } from "../../../components/ui/Modal";
import { UsuarioForm } from "../components/UsuarioForm";
import Swal from "sweetalert2";
import { swalConfirm } from "../../../utils/swalConfig";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const { user } = useContext(AuthContext) || {};

  /* 🔹 Cargar usuarios y roles */
  const cargarDatos = async () => {
    try {
      const [dataUsuarios, dataRoles] = await Promise.all([getUsuarios(), getRoles()]);
      setUsuarios(dataUsuarios);
      setRoles(dataRoles);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  /* 🧩 Crear nuevo usuario */
  const handleCrear = async (data: UsuarioFormData) => {
    await createUsuario(data);
    Swal.fire("Éxito", "Usuario creado correctamente", "success");
    setShowModal(false);
    cargarDatos();
  };

  /* 🧩 Editar usuario existente */
  const handleEditar = async (data: UsuarioFormData) => {
    if (!editUser) return;
    await updateUsuario(editUser.id, data);
    Swal.fire("Guardado", "Usuario actualizado", "success");
    setShowModal(false);
    setEditUser(null);
    cargarDatos();
  };

  /* 🧩 Activar / Desactivar usuario */
  const handleToggle = async (u: Usuario) => {
    const confirm = await swalConfirm(
      `¿Deseas ${u.activo ? "desactivar" : "activar"} al usuario ${u.nombre}?`
    );
    if (!confirm.isConfirmed) return;
    await toggleUsuarioActivo(u.id);
    Swal.fire("Listo", "Estado actualizado", "success");
    cargarDatos();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-4">👥 Gestión de Usuarios</h1>

      {user?.rol === "Admin" && (
        <Button onClick={() => setShowModal(true)} className="mb-4">
          + Nuevo Usuario
        </Button>
      )}

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Empleado</th>
              <th className="p-2">Activo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-100 text-center">
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{roles.find((r) => r.id === u.idRol)?.nombre || "-"}</td>
                <td>{u.empleadoNombre || "—"}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      u.activo ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="space-x-2">
                  {user?.rol === "Admin" && (
                    <>
                      <Button
                        onClick={() => {
                          setEditUser(u);
                          setShowModal(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button onClick={() => handleToggle(u)} variant="secondary">
                        {u.activo ? "Desactivar" : "Activar"}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* 🧩 Modal para crear/editar usuario */}
      <Modal
        title={editUser ? "Editar Usuario" : "Nuevo Usuario"}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditUser(null);
        }}
      >
        <UsuarioForm
          onSubmit={editUser ? handleEditar : handleCrear}
          roles={roles}
          initialData={editUser || {}}
          isEdit={!!editUser}
        />
      </Modal>
    </div>
  );
}
