import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function AdminUsuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalPass, setModalPass] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [passId, setPassId] = useState(null);

  const [form, setForm] = useState({
    correo: "",
    telefono: "",
    contrasena: "",
    rol: "",
    estado: "ACTIVO",
  });

  const [newPass, setNewPass] = useState("");

  // ============================
  // CARGAR USUARIOS
  // ============================
  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudo cargar la lista de usuarios", "error");
    }
  };

  // ============================
  // VALIDACIONES
  // ============================
  const validarCampos = () => {
    if (!form.correo.includes("@")) {
      Swal.fire("Error", "Correo inválido", "error");
      return false;
    }
    if (!/^[0-9]{9}$/.test(form.telefono)) {
      Swal.fire("Error", "El teléfono debe tener 9 dígitos", "error");
      return false;
    }
    if (!editingId && form.contrasena.length < 5) {
      Swal.fire("Error", "La contraseña debe tener al menos 5 caracteres", "error");
      return false;
    }
    return true;
  };

  // ============================
  // ABRIR MODAL (CREAR)
  // ============================
  const abrirCrear = () => {
    setForm({
      correo: "",
      telefono: "",
      contrasena: "",
      rol: "",
      estado: "ACTIVO",
    });
    setEditingId(null);
    setModal(true);
  };

  // ============================
  // GUARDAR
  // ============================
  const guardar = async () => {
    if (!validarCampos()) return;

    try {
      if (!editingId) {
        await axios.post("http://localhost:8080/api/admin/usuarios", form);
        Swal.fire("✔ Usuario creado", "", "success");
      } else {
        await axios.put(`http://localhost:8080/api/admin/usuarios/${editingId}`, form);
        Swal.fire("✔ Usuario editado", "", "success");
      }

      setModal(false);
      cargar();

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  // ============================
  // ELIMINAR
  // ============================
  const eliminar = async (id) => {
    const conf = await Swal.fire({
      title: "¿Eliminar usuario?",
      icon: "warning",
      showCancelButton: true
    });

    if (!conf.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/usuarios/${id}`);
      Swal.fire("Eliminado", "", "success");
      cargar();
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  // ============================
  // CAMBIAR ESTADO
  // ============================
  const cambiarEstado = async (id, estado) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/usuarios/${id}/estado`, estado, {
        headers: { "Content-Type": "text/plain" }
      });
      cargar();
    } catch (err) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  // ============================
  // CAMBIAR CONTRASEÑA
  // ============================
  const abrirCambiarPass = (id) => {
    setPassId(id);
    setNewPass("");
    setModalPass(true);
  };

  const guardarPass = async () => {
    if (newPass.length < 5) {
      Swal.fire("Error", "Contraseña muy corta", "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/admin/usuarios/${passId}/password`,
        newPass,
        { headers: { "Content-Type": "text/plain" } }
      );

      Swal.fire("✔ Contraseña actualizada", "", "success");
      setModalPass(false);
    } catch (err) {
      Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
    }
  };

  // ============================
  // RENDER
  // ============================
  return (
    <div className="container mt-4">

      <h2 className="fw-bold mb-3">Gestión de Usuarios</h2>

      <button className="btn btn-primary mb-3" onClick={abrirCrear}>
        ➕ Crear Usuario
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map(u => (
            <tr key={u.idUsuario}>
              <td>{u.idUsuario}</td>
              <td>{u.correo}</td>
              <td>{u.telefono}</td>
              <td>{u.rol}</td>

              <td>
                {u.estado === "ACTIVO" ? (
                  <span className="badge bg-success">ACTIVO</span>
                ) : (
                  <span className="badge bg-danger">INACTIVO</span>
                )}
              </td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditingId(u.idUsuario);
                    setForm({
                      correo: u.correo,
                      telefono: u.telefono,
                      rol: u.rol,
                      estado: u.estado,
                      contrasena: ""
                    });
                    setModal(true);
                  }}
                >
                  Editar
                </button>

                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => abrirCambiarPass(u.idUsuario)}
                >
                  Contraseña
                </button>

                <button
                  className={`btn btn-${u.estado === "ACTIVO" ? "secondary" : "success"} btn-sm me-2`}
                  onClick={() => cambiarEstado(u.idUsuario, u.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO")}
                >
                  {u.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(u.idUsuario)}
                >
                  Eliminar
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* MODAL CREAR / EDITAR */}
      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4>{editingId ? "Editar Usuario" : "Crear Usuario"}</h4>

              <input className="form-control mt-2" placeholder="Correo"
                value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />

              <input className="form-control mt-2" placeholder="Teléfono (9 dígitos)"
                value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />

              {!editingId && (
                <input type="password" className="form-control mt-2" placeholder="Contraseña"
                  value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })} />
              )}

              <select className="form-control mt-2"
                value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
                <option value="">Seleccione un rol</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="SUBADMINISTRADOR">SUBADMINISTRADOR</option>
                <option value="JUEZ">JUEZ</option>
                <option value="CLUB">CLUB</option>
                <option value="COMPETIDOR">COMPETIDOR</option>
              </select>

              <div className="mt-3 d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardar}>Guardar</button>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* MODAL CAMBIAR CONTRASEÑA */}
      {modalPass && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4>Cambiar Contraseña</h4>

              <input
                type="password"
                className="form-control mt-2"
                placeholder="Nueva contraseña"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />

              <div className="mt-3 d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setModalPass(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardarPass}>Guardar</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
