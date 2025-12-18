import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ClubTorneos() {

  const [torneos, setTorneos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(
      "http://localhost:8080/api/club/torneos/disponibles",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => setTorneos(res.data))
      .catch(err => {
        console.error(err);
        alert("Error cargando torneos");
      });
  }, [token]);

  return (
    <div className="container mt-4">
      <h3>Torneos por Equipos</h3>

      <table className="table table-dark table-bordered mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {torneos.map(t => (
            <tr key={t.idTorneo}>
              <td>{t.nombre}</td>
              <td>{new Date(t.fechaInicio).toLocaleString()}</td>
              <td>{new Date(t.fechaFin).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    navigate(`/club/torneos/${t.idTorneo}/categorias`)
                  }
                >
                  Ver categorías
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
