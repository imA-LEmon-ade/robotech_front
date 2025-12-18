import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/robots.css";

export default function Robots() {
  const robotsMock = [
    {
      id: 1,
      nombre: "Talon-X",
      categoria: "Minisumo",
      dueño: "Juan Pérez",
      imagen: "/img/robot1.jpeg"
    },
    {
      id: 2,
      nombre: "Titan-5",
      categoria: "Megasumo",
      dueño: "Ana Torres",
      imagen: "/img/robot2.png"
    },
    {
      id: 3,
      nombre: "Raptor",
      categoria: "Guerra 1v1",
      dueño: "Luis Vega",
      imagen: "/img/robot3.png"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="fw-bold text-center mb-4">Robots Registrados</h2>

        <div className="row g-4">
          {robotsMock.map(r => (
            <div key={r.id} className="col-12 col-sm-6 col-md-4">
              <div className="robot-card shadow-sm">
                <img src={r.imagen} alt="" className="robot-img" />

                <div className="p-3">
                  <h5 className="fw-bold">{r.nombre}</h5>
                  <span className="badge bg-dark mb-2">{r.categoria}</span>
                  <p className="m-0 text-muted">Dueño: {r.dueño}</p>
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
