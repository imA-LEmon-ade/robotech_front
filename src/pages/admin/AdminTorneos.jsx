import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function AdminTorneos() {

  const [torneos, setTorneos] = useState([]);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    fechaAperturaInscripcion: "",
    fechaCierreInscripcion: "",
    estado: "ABIERTO",
    tipo: "INDIVIDUAL"     // <-- AGREGADO
  });

  // =============================
  //   CARGAR TORNEOS
  // =============================
  const cargar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/torneos");
      setTorneos(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar torneos", "error");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  
  // =============================
  //   CAMBIAR ESTADO (ADMIN)
  // =============================
  const cambiarEstado = async (idTorneo, nuevoEstado) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/torneos/${idTorneo}/estado`,
        { estado: nuevoEstado }
      );

      await Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        confirmButtonColor: "#3085d6"
      });

      cargar();

    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err?.response?.data ?? "No se pudo cambiar el estado",
        "error"
      );
    }
  };

  // =============================
  //   ABRIR MODAL CREAR
  // =============================
  const abrirCrear = () => {
    setForm({
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      fechaAperturaInscripcion: "",
      fechaCierreInscripcion: "",
      estado: "ABIERTO",
      tipo: "INDIVIDUAL"   // <-- AGREGADO
    });
    setEditingId(null);
    setModal(true);
  };

  // =============================
  //   GUARDAR TORNEO
  // =============================
  const guardar = async () => {
    try {
      if (!editingId) {
        await axios.post("http://localhost:8080/api/admin/torneos", form);
        Swal.fire("✔ Torneo creado", "", "success");
      } else {
        await axios.put(
          `http://localhost:8080/api/admin/torneos/${editingId}`,
          form
        );
        Swal.fire("✔ Torneo actualizado", "", "success");
      }

      setModal(false);
      cargar();

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el torneo", "error");
    }
  };

  // =============================
  //   ELIMINAR TORNEO
  // =============================
  const eliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar Torneo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/torneos/${id}`);
      Swal.fire("Eliminado", "", "success");
      cargar();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar el torneo", "error");
    }
  };

  const gestionarCategorias = (id) => {
    window.location.href = `/admin/torneos/${id}/categorias`;
  };

  const f = (fecha) => fecha ? new Date(fecha).toLocaleString() : "—";

  return (
    <div className="container mt-4">

      <h2 className="fw-bold">Gestión de Torneos</h2>

      <button className="btn btn-primary my-3" onClick={abrirCrear}>
        ➕ Crear torneo
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Inscripción</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Categorías</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {torneos.length === 0 ? (
            <tr><td colSpan="8" className="text-center">No hay torneos registrados</td></tr>
          ) : (
            torneos.map(t => (
              <tr key={t.idTorneo}>
                <td>{t.nombre}</td>
                <td>{f(t.fechaInicio)}</td>
                <td>{f(t.fechaFin)}</td>
                <td>{f(t.fechaAperturaInscripcion)} <br />→ {f(t.fechaCierreInscripcion)}</td>
                
              <td>
                <select
                  className="form-control"
                  value={t.estado}
                  disabled={t.estado === "FINALIZADO"}
                  onChange={e =>
                    cambiarEstado(t.idTorneo, e.target.value)
                  }
                >
                  <option value="BORRADOR">BORRADOR</option>
                  <option value="INSCRIPCIONES_ABIERTAS">INSCRIPCIONES_ABIERTAS</option>
                  <option value="EN_PROGRESO">EN_PROGRESO</option>
                  <option value="FINALIZADO">FINALIZADO</option>
                </select>
              </td>

                <td>{t.tipo}</td>



                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => gestionarCategorias(t.idTorneo)}
                  >
                    Categorías
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingId(t.idTorneo);
                      setForm({
                        nombre: t.nombre,
                        descripcion: t.descripcion,
                        fechaInicio: t.fechaInicio,
                        fechaFin: t.fechaFin,
                        fechaAperturaInscripcion: t.fechaAperturaInscripcion,
                        fechaCierreInscripcion: t.fechaCierreInscripcion,
                        estado: t.estado,
                        tipo: t.tipo          // <-- AGREGADO
                      });
                      setModal(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminar(t.idTorneo)}
                  >
                    Eliminar
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ======================= MODAL ======================= */}
      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4>{editingId ? "Editar Torneo" : "Crear Torneo"}</h4>

              <input className="form-control mt-2" placeholder="Nombre"
                value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />

              <textarea className="form-control mt-2" placeholder="Descripción"
                value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />

              <label className="mt-3 fw-bold">Fecha inicio</label>
              <input type="datetime-local" className="form-control"
                value={form.fechaInicio}
                onChange={e => setForm({ ...form, fechaInicio: e.target.value })} />

              <label className="mt-3 fw-bold">Fecha fin</label>
              <input type="datetime-local" className="form-control"
                value={form.fechaFin}
                onChange={e => setForm({ ...form, fechaFin: e.target.value })} />

              <label className="mt-3 fw-bold">Apertura inscripción</label>
              <input type="datetime-local" className="form-control"
                value={form.fechaAperturaInscripcion}
                onChange={e => setForm({ ...form, fechaAperturaInscripcion: e.target.value })} />

              <label className="mt-3 fw-bold">Cierre inscripción</label>
              <input type="datetime-local" className="form-control"
                value={form.fechaCierreInscripcion}
                onChange={e => setForm({ ...form, fechaCierreInscripcion: e.target.value })} />

              {/* ------------------ NUEVO: TIPO ------------------ */}
              <label className="mt-3 fw-bold">Tipo</label>
              <select className="form-control"
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}>
                <option value="INDIVIDUAL">INDIVIDUAL</option>
                <option value="EQUIPOS">EQUIPOS</option>
              </select>
              {/* -------------------------------------------------- */}

              <label className="mt-3 fw-bold">Estado</label>
              <select className="form-control"
                value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}>
                <option value="ABIERTO">ABIERTO</option>
                <option value="CERRADO">CERRADO</option>
                <option value="EN_CURSO">EN CURSO</option>
                <option value="FINALIZADO">FINALIZADO</option>
              </select>

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
