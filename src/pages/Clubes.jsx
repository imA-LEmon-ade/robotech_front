import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/clubes.css";
import { useState } from "react";

export default function Clubes() {
  const clubesMock = [
    {
      id: 1,
      nombre: "Robotech Elite",
      competidores: 16,
      ranking: 2,
      logo: "/img/club1.jpg",
      descripcion:
        "Club especializado en robots sumo y minisumo. Participa en torneos nacionales e internacionales."
    },
    {
      id: 2,
      nombre: "RoboWarriors",
      competidores: 22,
      ranking: 1,
      logo: "/img/club2.jpg",
      descripcion:
        "Famoso por sus robots de guerra y megasumo. Campeones absolutos 2024."
    },
    {
      id: 3,
      nombre: "MechaForce",
      competidores: 9,
      ranking: 5,
      logo: "/img/club3.jpg",
      descripcion:
        "Equipo universitario que destaca por su innovación y diseño mecánico."
    }
  ];

  const [busqueda, setBusqueda] = useState("");
  const [clubSeleccionado, setClubSeleccionado] = useState(null);

  const clubesFiltrados = clubesMock.filter((club) =>
    club.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Clubes Registrados</h2>

        {/* Buscador */}
        <input 
          type="text" 
          className="form-control mb-4 mx-auto buscador" 
          placeholder="Buscar club por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Grid de Clubes */}
        <div className="row g-4">
          {clubesFiltrados.map((club) => (
            <div key={club.id} className="col-12 col-sm-6 col-md-4">
              <div className="card club-card shadow-sm">
                <img src={club.logo} alt="logo" className="club-logo" />

                <div className="card-body text-center">
                  <h5 className="fw-bold">{club.nombre}</h5>
                  <p className="text-muted">
                    {club.competidores} competidores
                  </p>
                  <span className="badge bg-primary mb-3">
                    Ranking #{club.ranking}
                  </span>

                  <button
                    className="btn btn-outline-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#modalClub"
                    onClick={() => setClubSeleccionado(club)}
                  >
                    Ver Club
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DEL CLUB */}
      <div
        className="modal fade"
        id="modalClub"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {clubSeleccionado && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {clubSeleccionado.nombre}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>

                <div className="modal-body text-center">
                  <img
                    src={clubSeleccionado.logo}
                    alt="club logo"
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "150px" }}
                  />

                  <p className="text-muted">
                    {clubSeleccionado.descripcion}
                  </p>

                  <p>
                    <strong>Competidores:</strong>{" "}
                    {clubSeleccionado.competidores}
                  </p>

                  <span className="badge bg-primary">
                    Ranking #{clubSeleccionado.ranking}
                  </span>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
