import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { generarEncuentros } from "../../services/encuentrosAdminService";
import api from "../../services/axiosConfig";

export default function AdminGenerarEncuentros() {
  const { idCategoria } = useParams();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("");
  const [jueces, setJueces] = useState([]);
  const [coliseos, setColiseos] = useState([]);
  const [idJuez, setIdJuez] = useState("");
  const [idColiseo, setIdColiseo] = useState("");

  // cargar jueces y coliseos
  useState(() => {
    api.get("/api/admin/jueces").then(r => setJueces(r.data));
    api.get("/api/admin/coliseos").then(r => setColiseos(r.data));
  }, []);

  const generar = async () => {
    if (!tipo || !idJuez || !idColiseo) {
      Swal.fire("Atención", "Completa todos los campos", "warning");
      return;
    }

    try {
      await generarEncuentros({
        idCategoriaTorneo: idCategoria,
        tipoEncuentro: tipo,
        idJuez,
        idColiseo
      });

      Swal.fire("✔ Encuentros creados", "", "success");
      navigate("/admin/encuentros");

    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data ?? "No se pudieron generar",
        "error"
      );
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="fw-bold mb-3">Generar Encuentros</h4>

      <select className="form-select mb-3" onChange={e => setTipo(e.target.value)}>
        <option value="">Tipo de Encuentro</option>
        <option value="ELIMINACION_DIRECTA">Eliminación Directa</option>
        <option value="TODOS_CONTRA_TODOS">Todos contra Todos</option>
      </select>

      <select className="form-select mb-3" onChange={e => setIdJuez(e.target.value)}>
        <option value="">Seleccionar Juez</option>
        {jueces.map(j => (
          <option key={j.idJuez} value={j.idJuez}>{j.nombre}</option>
        ))}
      </select>

      <select className="form-select mb-3" onChange={e => setIdColiseo(e.target.value)}>
        <option value="">Seleccionar Coliseo</option>
        {coliseos.map(c => (
          <option key={c.idColiseo} value={c.idColiseo}>{c.nombre}</option>
        ))}
      </select>

      <button className="btn btn-success w-100" onClick={generar}>
        Generar Encuentros
      </button>
    </div>
  );
}
