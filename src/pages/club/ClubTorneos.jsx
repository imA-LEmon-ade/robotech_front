import { useEffect, useMemo, useState } from "react";
import api from "../../services/axiosConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../styles/clubTorneos.css";

export default function ClubTorneos() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatearFecha = useMemo(() => {
    return (iso) =>
      new Date(iso).toLocaleString("es-PE", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
  }, []);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get("/club/torneos/disponibles");
        setTorneos(res.data);
      } catch (err) {
        console.error(err);
        const msg =
          err?.response?.data?.mensaje ||
          err?.response?.data?.message ||
          err?.response?.data ||
          "Error cargando torneos";
        Swal.fire("Error", msg, "error");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Torneos por Equipos</h2>
          <p className="text-muted mb-0">Selecciona un torneo para ver sus categorías</p>
        </div>

        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <p className="text-muted mt-3 mb-0">Cargando torneos…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && torneos.length === 0 && (
        <div className="alert alert-info text-center">
          No hay torneos disponibles en este momento.
        </div>
      )}

      {/* Cards */}
      {!loading && torneos.length > 0 && (
        <div className="row g-4">
          {torneos.map((t) => (
            <div className="col-md-6 col-lg-4" key={t.idTorneo}>
              <div className="card h-100 shadow-sm border-0 torneo-card">
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold mb-3">{t.nombre}</h5>

                  <div className="mb-3">
                    <div className="text-muted small">Inicio</div>
                    <div className="fw-semibold">{formatearFecha(t.fechaInicio)}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-muted small">Fin</div>
                    <div className="fw-semibold">{formatearFecha(t.fechaFin)}</div>
                  </div>

                  <button
                    className="btn btn-primary mt-auto w-100"
                    onClick={() => navigate(`/club/torneos/${t.idTorneo}/categorias`)}
                  >
                    Ver categorías
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
