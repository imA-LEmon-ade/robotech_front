import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/CompetidorPanel.css";

export default function CompetidorDashboard() {

  const [competidor, setCompetidor] = useState(null);
  const navigate = useNavigate();

  const entidadRaw = localStorage.getItem("entidad");
  const entidad = entidadRaw ? JSON.parse(entidadRaw) : null;
  const idCompetidor = entidad?.idCompetidor;

  useEffect(() => {
    if (idCompetidor) cargarPerfil();
  }, [idCompetidor]);

  const cargarPerfil = async () => {
    try {
      const res = await axios.get(`/api/competidores/${idCompetidor}`);
      setCompetidor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!idCompetidor) return <div>No autorizado</div>;
  if (!competidor) return <div>Cargando...</div>;

  return (
    <div className="competidor-card shadow">
      <img
        src={competidor.fotoUrl || "/default-user.png"}
        alt="foto competidor"
        className="competidor-avatar"
      />

      <h2 className="competidor-name">{competidor.nombre}</h2>
      <p className="competidor-desc">Competidor registrado</p>

      <div className="competidor-stats">
        <div>
          <h4>{competidor.totalRobots}</h4>
          <span>Robots</span>
        </div>
        <div>
          <h4>{competidor.totalTorneos}</h4>
          <span>Torneos</span>
        </div>
        <div>
          <h4>{competidor.puntosRanking}</h4>
          <span>Puntos</span>
        </div>
      </div>

      <div className="competidor-actions">
        <button className="btn-primary" onClick={() => navigate("robots")}>
          Mis Robots
        </button>

        <button className="btn-primary" onClick={() => navigate("torneos")}>
          Mis Torneos
        </button>

        <button className="btn-primary" onClick={() => navigate("ranking")}>
          Ver Ranking
        </button>
      </div>
    </div>
  );
}
