import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ClubInscribirEquipo() {

  const { idCategoria } = useParams();
  const [robots, setRobots] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  const club = JSON.parse(localStorage.getItem("usuario"));
  const clubId = club?.idClub;

  useEffect(() => {
    axios.get(`http://localhost:8080/api/club/robots`, {
      headers: { "club-id": clubId }
    })
    .then(res => setRobots(res.data))
    .catch(() => alert("Error cargando robots"));
  }, []);

  const toggleRobot = (id) => {
    setSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const inscribir = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/club/inscripciones/equipos",
        {
          idCategoriaTorneo: idCategoria,
          robots: seleccionados
        },
        { headers: { "club-id": clubId } }
      );

      Swal.fire("Equipo inscrito", "", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "No se pudo inscribir",
        "error"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Inscribir Equipo</h3>

      <table className="table table-dark table-bordered mt-3">
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Robot</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {robots.map(r => (
            <tr key={r.idRobot}>
              <td>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(r.idRobot)}
                  onChange={() => toggleRobot(r.idRobot)}
                />
              </td>
              <td>{r.nombre}</td>
              <td>{r.categoria}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-success mt-3"
        disabled={seleccionados.length === 0}
        onClick={inscribir}
      >
        Inscribir equipo
      </button>
    </div>
  );
}
