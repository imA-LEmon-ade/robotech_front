import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function AdminJueces() {

  const [jueces, setJueces] = useState([]);
  const [form, setForm] = useState({
    correo: "",
    telefono: "",
    contrasena: "",
    licencia: ""
  });

  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Usuario logueado (ADMIN / SUBADMIN)
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const adminId = usuario?.idUsuario; // ID del creador / validador

  // =========================
  // CARGAR LISTA
  // =========================
  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/jueces");
      setJueces(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar la lista de jueces", "error");
    }
  };

  // =========================
  // ABRIR MODAL CREAR
  // =========================
  const abrirCrear = () => {
    setForm({ correo: "", telefono: "", contrasena: "", licencia: "" });
    setEditingId(null);
    setModal(true);
  };

  // =========================
  // VALIDACIONES
  // =========================
  const validarCampos = () => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^[0-9]{9}$/;

    if (!correoRegex.test(form.correo)) {
      Swal.fire("Correo inválido", "Ingresa un correo válido", "warning");
      return false;
    }

    if (!telRegex.test(form.telefono)) {
      Swal.fire("Teléfono inválido", "Debe tener 9 dígitos", "warning");
      return false;
    }

    if (!editingId && form.contrasena.length < 6) {
      Swal.fire("Contraseña débil", "Debe tener mínimo 6 caracteres", "warning");
      return false;
    }

    return true;
  };

  // =========================
  // GUARDAR (CREAR / EDITAR)
  // =========================
  const guardar = async () => {

    if (!validarCampos()) return;

    try {
      if (!editingId) {
        // CREAR JUEZ
        await axios.post(
          "http://localhost:8080/api/admin/jueces",
          {
            ...form,
            creadoPor: adminId
          }
        );

        Swal.fire("✔ Juez creado correctamente", "", "success");

      } else {
        // EDITAR JUEZ
        await axios.put(
          `http://localhost:8080/api/admin/jueces/${editingId}`,
          form
        );

        Swal.fire("✔ Datos actualizados", "", "success");
      }

      setModal(false);
      cargar();

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la información", "error");
    }
  };

  // =========================
  // ELIMINAR JUEZ
  // =========================
  const eliminar = async (idJuez) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar juez?",
      text: "Esta acción es irreversible",
      icon: "warning",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/jueces/${idJuez}`);
      Swal.fire("Juez eliminado", "", "success");
      cargar();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar al juez", "error");
    }
  };

  // =========================
  // APROBAR JUEZ
  // =========================
  const aprobar = async (idJuez) => {
    const confirm = await Swal.fire({
      title: "¿Aprobar juez?",
      icon: "question",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:8080/api/admin/jueces/${idJuez}/aprobar`,
        {},
        { headers: { "admin-id": adminId } }
      );

      Swal.fire("✔ Juez aprobado", "", "success");
      cargar();

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo aprobar al juez", "error");
    }
  };

  // =========================
  // RECHAZAR JUEZ
  // =========================
  const rechazar = async (idJuez) => {

    const confirm = await Swal.fire({
      title: "¿Rechazar juez?",
      icon: "warning",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:8080/api/admin/jueces/${idJuez}/rechazar`,
        {},
        { headers: { "admin-id": adminId } }
      );

      Swal.fire("✔ Juez rechazado", "", "success");
      cargar();

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo rechazar al juez", "error");
    }
  };

  // =========================
  // FORMATEAR FECHA
  // =========================
  const formatFecha = (f) => {
    if (!f) return "—";
    return new Date(f).toLocaleString();
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="container mt-4">
      
      <h2 className="fw-bold mb-3">Gestión de Jueces</h2>

      <button className="btn btn-primary my-3" onClick={abrirCrear}>
        ➕ Crear Juez
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Licencia</th>
            <th>Estado</th>
            <th>Creado por</th>
            <th>Creado en</th>
            <th>Validado por</th>
            <th>Validado en</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {jueces.length === 0 ? (
            <tr><td colSpan="9" className="text-center text-muted">No hay jueces registrados</td></tr>
          ) : (
            jueces.map(j => (
              <tr key={j.idJuez}>
                
                <td>{j.usuario?.correo}</td>
                <td>{j.usuario?.telefono}</td>
                <td>{j.licencia}</td>

                <td>
                  {j.estadoValidacion === "APROBADO" && <span className="badge bg-success">APROBADO</span>}
                  {j.estadoValidacion === "PENDIENTE" && <span className="badge bg-warning">PENDIENTE</span>}
                  {j.estadoValidacion === "RECHAZADO" && <span className="badge bg-danger">RECHAZADO</span>}
                </td>

                <td>{j.creadoPor ?? "—"}</td>
                <td>{formatFecha(j.creadoEn)}</td>

                <td>{j.validadoPor ?? "—"}</td>
                <td>{formatFecha(j.validadoEn)}</td>

                <td>
                  {j.estadoValidacion === "PENDIENTE" && (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => aprobar(j.idJuez)}>
                        Aprobar
                      </button>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => rechazar(j.idJuez)}>
                        Rechazar
                      </button>
                    </>
                  )}

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingId(j.idJuez);
                      setForm({
                        correo: j.usuario?.correo || "",
                        telefono: j.usuario?.telefono || "",
                        contrasena: "",
                        licencia: j.licencia
                      });
                      setModal(true);
                    }}
                  >
                    Editar
                  </button>

                  <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(j.idJuez)}>
                    Eliminar
                  </button>

                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4>{editingId ? "Editar Juez" : "Crear Juez"}</h4>

              <input className="form-control mt-2" placeholder="Correo"
                value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />

              <input className="form-control mt-2" placeholder="Teléfono"
                value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />

              {!editingId && (
                <input type="password" className="form-control mt-2" placeholder="Contraseña"
                  value={form.contrasena}
                  onChange={e => setForm({ ...form, contrasena: e.target.value })} />
              )}

              <input className="form-control mt-2" placeholder="Licencia"
                value={form.licencia} onChange={e => setForm({ ...form, licencia: e.target.value })} />

              <div className="mt-3 d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardar}>Guardar</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
