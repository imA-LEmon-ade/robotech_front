import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ClubCategoriasTorneo() {

  const { idTorneo } = useParams();
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/admin/torneos/${idTorneo}/categorias`)
      .then(res => setCategorias(res.data))
      .catch(() => alert("Error cargando categorías"));
  }, [idTorneo]);

  return (
    <div className="container mt-4">
      <h3>Categorías del Torneo</h3>

      <table className="table table-dark table-bordered mt-3">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Max equipos</th>
            <th>Max integrantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(c => (
            <tr key={c.idCategoriaTorneo}>
              <td>{c.categoria}</td>
              <td>{c.maxParticipantes}</td>
              <td>{c.maxIntegrantesEquipo}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() =>
                    navigate(`/club/categorias/${c.idCategoriaTorneo}/inscribir`)
                  }
                >
                  Inscribir equipo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
