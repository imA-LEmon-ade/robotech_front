import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function AdminCategoriasTorneo() {

  const { idTorneo } = useParams();

  const [torneo, setTorneo] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    categoria: "",
    descripcion: "",
    maxParticipantes: 8
  });

  // ==========================================================
  // CARGAR TORNEO + CATEGORÍAS
  // ==========================================================
  const cargar = async () => {
    try {
      const torneoRes = await axios.get(
        `http://localhost:8080/api/admin/torneos/${idTorneo}`
      );

      const categoriasRes = await axios.get(
        `http://localhost:8080/api/admin/categorias-torneo/${idTorneo}`
      );

      setTorneo(torneoRes.data);
      setCategorias(categoriasRes.data);

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar la información", "error");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // ==========================================================
  // CREAR / EDITAR
  // ==========================================================
  const abrirCrear = () => {
    setForm({
      categoria: "",
      descripcion: "",
      maxParticipantes: 8
    });
    setEditingId(null);
    setModal(true);
  };

  const guardar = async () => {
    try {
      if (!editingId) {
        // CREAR NUEVA
        await axios.post(
          `http://localhost:8080/api/admin/categorias-torneo/${idTorneo}`,
          form
        );
        Swal.fire("✔ Categoría creada", "", "success");

      } else {
        // EDITAR EXISTENTE
        await axios.put(
          `http://localhost:8080/api/admin/categorias-torneo/${editingId}`,
          form
        );
        Swal.fire("✔ Categoría actualizada", "", "success");
      }

      setModal(false);
      cargar();

    } catch (err) {
      console.error("ERROR:", err);
      Swal.fire("Error", "No se pudo guardar la categoría", "error");
    }
  };

  // ==========================================================
  // ELIMINAR
  // ==========================================================
  const eliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    try {

      await axios.delete(
        `http://localhost:8080/api/admin/categorias-torneo/${id}`
      );

      Swal.fire("Eliminado", "", "success");
      cargar();

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar la categoría", "error");
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="container mt-4">

      <h2 className="fw-bold">Categorías del Torneo</h2>

      {torneo && (
        <p className="text-muted">
          Torneo: <strong>{torneo.nombre}</strong>
        </p>
      )}

      <button className="btn btn-primary my-3" onClick={abrirCrear}>
        ➕ Crear Categoría
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Máx Participantes</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categorias.length === 0 ? (
            <tr><td colSpan="4" className="text-center">No hay categorías</td></tr>
          ) : (
            categorias.map(c => (
              <tr key={c.idCategoriaTorneo}>
                <td>{c.categoria}</td>
                <td>{c.maxParticipantes}</td>
                <td>{c.descripcion}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingId(c.idCategoriaTorneo);
                      setForm({
                        categoria: c.categoria,
                        descripcion: c.descripcion,
                        maxParticipantes: c.maxParticipantes
                      });
                      setModal(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminar(c.idCategoriaTorneo)}
                  >
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
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h4>{editingId ? "Editar Categoría" : "Crear Categoría"}</h4>

              <input className="form-control mt-2" placeholder="Nombre categoría"
                value={form.categoria}
                onChange={e => setForm({ ...form, categoria: e.target.value })} />

              <textarea className="form-control mt-2" placeholder="Descripción"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })} />

              <input className="form-control mt-2" type="number" min="1"
                placeholder="Máximo participantes"
                value={form.maxParticipantes}
                onChange={e => setForm({ ...form, maxParticipantes: e.target.value })} />

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
