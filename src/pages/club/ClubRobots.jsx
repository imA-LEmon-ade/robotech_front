import { useEffect, useState } from "react";
import { getMisRobots } from "../../services/robotService";

const ClubRobots = () => {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRobots = async () => {
      try {
        const data = await getMisRobots();
        setRobots(data);
      } catch (error) {
        console.error("Error cargando robots", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRobots();
  }, []);

  if (loading) return <p>Cargando robots...</p>;

  return (
    <div>
      <h2>Mis Robots</h2>

      {robots.length === 0 ? (
        <p>No tienes robots registrados</p>
      ) : (
        <ul>
          {robots.map((robot) => (
            <li key={robot.idRobot}>
              <strong>{robot.nombre}</strong> – {robot.categoria} ({robot.nickname})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClubRobots;
