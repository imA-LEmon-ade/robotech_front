import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/axiosConfig";

export default function ClubInscribirEquipo() {
  const { idTorneo } = useParams();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCategorias = async () => {
    try {
      const res = await api.get(`/api/club/torneos/${idTorneo}/categorias`);
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, [idTorneo]);

  if (loading) return <p>Cargando categorías...</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">🏆 Categorías del Torneo</h2>

      {categorias.length === 0 ? (
        <div className="alert alert-info">
          No hay categorías registradas para este torneo
        </div>
      ) : (
        <div className="row g-4">
          {categorias.map((cat) => (
            <div
              key={cat.idCategoriaTorneo}
              className="col-md-6 col-lg-4"
            >
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{cat.categoria}</h5>

                  <span
                    className={`badge mb-2 ${
                      cat.modalidad === "EQUIPO"
                        ? "bg-primary"
                        : "bg-success"
                    }`}
                  >
                    {cat.modalidad}
                  </span>

                  <p className="card-text mt-2 text-muted">
                    {cat.descripcion || "Sin descripción"}
                  </p>

                  <ul className="list-group list-group-flush mb-3">
                    {cat.maxParticipantes && (
                      <li className="list-group-item px-0">
                        👥 Máx. participantes:{" "}
                        <strong>{cat.maxParticipantes}</strong>
                      </li>
                    )}
                    {cat.maxEquipos && (
                      <li className="list-group-item px-0">
                        🤖 Máx. equipos:{" "}
                        <strong>{cat.maxEquipos}</strong>
                      </li>
                    )}
                  </ul>

                  <button className="btn btn-outline-primary w-100">
                    Inscribirse
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 