import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/CompetidorPanel.css";

export default function CompetidorPanel() {

  const items = [
    { label: "Mis Robots", to: "/competidor/robots" },
    { label: "Mis Torneos", to: "/competidor/torneos" },
    { label: "Ranking", to: "/competidor/ranking" }
  ];

  const [competidor, setCompetidor] = useState(null);

  const entidad = JSON.parse(localStorage.getItem("entidad"));
  const idCompetidor = entidad?.idCompetidor;

  useEffect(() => {
    if (idCompetidor) cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/competidores/${idCompetidor}`);
      setCompetidor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!competidor) return <div>Cargando...</div>;

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar titulo="Panel Competidor" items={items} />

        <div className="flex-grow-1 p-4">

          {/* PERFIL DEL COMPETIDOR */}
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
              <button className="btn-primary" onClick={() => window.location.href = "/competidor/robots"}>
                Mis Robots
              </button>

              <button className="btn-primary" onClick={() => window.location.href = "/competidor/torneos"}>
                Mis Torneos
              </button>

              <button className="btn-primary" onClick={() => window.location.href = "/competidor/ranking"}>
                Ver Ranking
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
