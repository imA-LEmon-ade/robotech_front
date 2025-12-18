import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/competidores.css";

export default function Competidores() {
  const competidoresMock = [
    {
      id: 1,
      nombre: "Juan Pérez",
      club: "Robotech Elite",
      puntos: 1240,
      ranking: 3,
      foto: "/img/avatar1.jpg"
    },
    {
      id: 2,
      nombre: "Ana Torres",
      club: "RoboWarriors",
      puntos: 1580,
      ranking: 1,
      foto: "/img/avatar2.jpg"
    },
    {
      id: 3,
      nombre: "Luis Vega",
      club: "MechaForce",
      puntos: 980,
      ranking: 5,
      foto: "/img/avatar3.jpg"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Competidores</h2>

        <div className="row g-4">
          {competidoresMock.map(c => (
            <div className="col-12" key={c.id}>
              <div className="competidor-card shadow-sm p-3 d-flex align-items-center">
                
                <img src={c.foto} className="competidor-foto" />

                <div className="ms-3 flex-grow-1">
                  <h5 className="fw-bold mb-1">{c.nombre}</h5>
                  <p className="text-muted m-0">{c.club}</p>
                </div>

                <div className="text-end">
                  <span className="badge bg-success mb-2">#{c.ranking}</span>
                  <p className="fw-bold m-0">{c.puntos} pts</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
