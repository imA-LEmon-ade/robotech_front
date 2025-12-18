import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Clubes() {
  
  const [busqueda, setBusqueda] = useState("");
  const [clubes, setClubes] = useState([]);
  const [editando, setEditando] = useState(null); // club seleccionado
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    correoContacto: "",
    telefonoContacto: "",
    direccionFiscal: "",
    correoPropietario: "",
    telefonoPropietario: "",
    contrasenaPropietario: ""
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    cargarClubes();
  }, []);

  const cargarClubes = async () => {
    setLoading(true);
    const res = await axios.get(
      "http://localhost:8080/api/admin/clubes",
      { params: { nombre: busqueda } }
    );
    setClubes(res.data);
    setLoading(false);
  };

  useEffect(() => {
    cargarClubes();
  }, [busqueda]);
  
  const abrirModal = () => {
    setForm({
      nombre: "",
      correoContacto: "",
      telefonoContacto: "",
      direccionFiscal: "",
      correoPropietario: "",
      telefonoPropietario: "",
      contrasenaPropietario: ""
    });

    setModalOpen(true);
  };


  const crearClub = async () => {
    try {
      await axios.post("http://localhost:8080/api/admin/clubes", form);

      Swal.fire("✔ Club creado", "El club fue registrado correctamente", "success");

      setModalOpen(false);
      cargarClubes();
    } catch (err) {
      Swal.fire("❌ Error", "No se pudo crear el club", "error");
    }
  };


  // 🔹 Guardar cambios del club
  const guardarClub = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/clubes/${editando.idClub}`,
        editando
      );

      Swal.fire("Éxito", "Club actualizado correctamente", "success");
      setEditando(null);
      cargarClubes();

    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  // 🔹 Eliminar club
  const eliminarClub = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar club?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Eliminar",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`http://localhost:8080/api/admin/clubes/${id}`);
    Swal.fire("Eliminado", "El club ha sido eliminado", "success");
    cargarClubes();
  };


  return (
    <div className="p-4">

      <h2 className="fw-bold mb-3">Gestión de Clubes</h2>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* BOTÓN CREAR CLUB */}
      <button className="btn btn-primary mb-4" onClick={abrirModal}>
        ➕ Crear Nuevo Club
      </button>


      {/* TABLA */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr><td colSpan="5">Cargando...</td></tr>
          ) : clubes.length === 0 ? (
            <tr><td colSpan="5">No se encontraron clubes</td></tr>
          ) : clubes.map(c => (
            <tr key={c.idClub}>
              <td>{c.nombre}</td>
              <td>{c.correoContacto}</td>
              <td>{c.telefonoContacto}</td>
              <td>
                <span className={`badge bg-${c.estado === "ACTIVO" ? "success" : "secondary"}`}>
                  {c.estado}
                </span>
              </td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditando({ ...c })}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarClub(c.idClub)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      
      {/* MODAL CREAR CLUB */}
      {modalOpen && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4 className="fw-bold">Registrar Nuevo Club</h4>

              {/* FORMULARIO */}
              <input
                className="form-control mt-2"
                placeholder="Nombre del club"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Correo de contacto"
                value={form.correoContacto}
                onChange={e => setForm({ ...form, correoContacto: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Teléfono de contacto"
                value={form.telefonoContacto}
                onChange={e => setForm({ ...form, telefonoContacto: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Dirección fiscal"
                value={form.direccionFiscal}
                onChange={e => setForm({ ...form, direccionFiscal: e.target.value })}
              />

              <hr />

              <h5 className="fw-bold">Datos del Propietario</h5>

              <input
                className="form-control mt-2"
                placeholder="Correo del propietario"
                value={form.correoPropietario}
                onChange={e => setForm({ ...form, correoPropietario: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Teléfono del propietario"
                value={form.telefonoPropietario}
                onChange={e => setForm({ ...form, telefonoPropietario: e.target.value })}
              />

              <input
                type="password"
                className="form-control mt-2"
                placeholder="Contraseña del propietario"
                value={form.contrasenaPropietario}
                onChange={e => setForm({ ...form, contrasenaPropietario: e.target.value })}
              />

              {/* BOTONES */}
              <div className="mt-3 d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cerrar</button>
                <button className="btn btn-success" onClick={crearClub}>Guardar</button>
              </div>

            </div>
          </div>
        </div>
      )}
      
      {/* MODAL EDITAR */}
      {editando && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "#0008" }}>
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Editar Club</h5>
                <button className="btn-close" onClick={() => setEditando(null)}></button>
              </div>

              <div className="modal-body">

                <label>Nombre:</label>
                <input className="form-control mb-2"
                  value={editando.nombre}
                  onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                />

                <label>Correo:</label>
                <input className="form-control mb-2"
                  value={editando.correoContacto}
                  onChange={(e) => setEditando({ ...editando, correoContacto: e.target.value })}
                />

                <label>Teléfono:</label>
                <input className="form-control mb-2"
                  value={editando.telefonoContacto}
                  onChange={(e) => setEditando({ ...editando, telefonoContacto: e.target.value })}
                />

                <label>Estado:</label>
                <select
                  className="form-select"
                  value={editando.estado}
                  onChange={(e) => setEditando({ ...editando, estado: e.target.value })}
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditando(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardarClub}>Guardar</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

