import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/torneos.css";
import { useState } from "react";

export default function Torneos() {
  const torneosMock = [
    {
      id: 1,
      nombre: "Robotech Championship 2025",
      fechaInicio: "2025-04-12",
      fechaFin: "2025-04-14",
      estado: "Abierto",
      imagen: "/img/torneo1.jpg",
      descripcion: "El campeonato más grande de robots de combate.",
      reglas: "Cada robot debe cumplir con el reglamento estándar de combate RCX. Peso máximo 15 kg. No se permiten armas de fuego ni dispositivos que interfieran radiofrecuencias.",
      categorias: ["Combate 15kg", "Antweight", "Beetleweight"],
      premios: "Trofeos para los 3 primeros lugares y premios en efectivo.",
      ubicacion: "Polideportivo de Innovación – Lima, Perú",
    },
    {
      id: 2,
      nombre: "Liga SumoBots",
      fechaInicio: "2025-03-01",
      fechaFin: "2025-03-02",
      estado: "En curso",
      imagen: "/img/torneo2.png",
      descripcion: "Competencia enfocada en minisumo, sumo y megasumo.",
      reglas: "Minisumo debe medir 10x10 cm. Robots completamente autónomos. No se permiten armas activas.",
      categorias: ["Minisumo", "Sumo Autónomo", "Megasumo"],
      premios: "Medallas para los finalistas. Puntos acumulables por ranking anual.",
      ubicacion: "Centro Tecnológico Robotics Hub – Arequipa, Perú",
    },
    {
      id: 3,
      nombre: "Copa Guerra Robótica",
      fechaInicio: "2025-01-20",
      fechaFin: "2025-01-22",
      estado: "Finalizado",
      imagen: "/img/torneo3.webp",
      descripcion: "Robots 1v1 compitiendo en batallas de destrucción.",
      reglas: "Armas permitidas: giratorias, neumáticas y trituradoras. Prohibido: láser y descargas eléctricas. Peso máximo 12 kg.",
      categorias: ["Combate 12kg"],
      premios: "Premio único al campeón: Trofeo + kit de herramientas",
      ubicacion: "Arena TechCombat – Cusco, Perú",
    }
  ];


  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(""); // "", "Abierto", "En curso", "Finalizado"
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const verDetalles = (torneo) => {
    setTorneoSeleccionado(torneo);
  };
  const cerrarModal = () => {
    setTorneoSeleccionado(null);
  };



  const torneosFiltrados = torneosMock.filter((t) => {

  const coincideBusqueda =
    t.nombre.toLowerCase().includes(busqueda.toLowerCase());

  const coincideEstado =
    filtroEstado === "" || t.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="fw-bold text-center mb-4">Torneos Disponibles</h2>

        {/* Buscador */}
        <input
          type="text"
          className="form-control mb-4 buscador"
          placeholder="Buscar torneo por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Filtros */}
        <div className="text-center mb-4">

          <button
            className={`btn mx-2 ${filtroEstado === "Abierto" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFiltroEstado("Abierto")}
          >
            Abierto
          </button>

          <button
            className={`btn mx-2 ${filtroEstado === "En curso" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFiltroEstado("En curso")}
          >
            En curso
          </button>

          <button
            className={`btn mx-2 ${filtroEstado === "Finalizado" ? "btn-secondary" : "btn-outline-secondary"}`}
            onClick={() => setFiltroEstado("Finalizado")}
          >
            Finalizado
          </button>

          <button
            className="btn btn-outline-dark mx-2"
            onClick={() => setFiltroEstado("")}
          >
            Quitar filtro
          </button>

        </div>

        {/* Tarjetas de torneos */}
        <div className="row g-4">
          {torneosFiltrados.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-md-4">
              <div className="card torneo-card shadow-sm">

                <img src={t.imagen} alt="" className="torneo-img" />

                <div className="card-body">
                  <h5 className="fw-bold">{t.nombre}</h5>

                  <span
                    className={`badge estado-${t.estado.toLowerCase().replace(/\s+/g,"")} mb-2`}
                  >
                    {t.estado}
                  </span>

                  <p className="text-muted small m-0">
                    {t.fechaInicio} - {t.fechaFin}
                  </p>

                  <p className="mt-2">
                    {t.descripcion}
                  </p>

                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => setTorneoSeleccionado(t)}
                  >
                    Ver Detalles
                  </button>


                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalles */}
      {torneoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content modal-anim" onClick={(e) => e.stopPropagation()}>

            <button className="btn-close-modal" onClick={cerrarModal}>
              ✕
            </button>

            <img
              src={torneoSeleccionado.imagen}
              alt={torneoSeleccionado.nombre}
              className="modal-img"
            />

            <h3 className="fw-bold mt-3">{torneoSeleccionado.nombre}</h3>

            <span
              className={`badge estado-${torneoSeleccionado.estado.toLowerCase().replace(/\s+/g,"")}`}
            >
              {torneoSeleccionado.estado}
            </span>

            <div className="modal-section">
              <p><strong>📅 Fechas:</strong> {torneoSeleccionado.fechaInicio} — {torneoSeleccionado.fechaFin}</p>

              <p><strong>📍 Ubicación:</strong> {torneoSeleccionado.ubicacion}</p>

              <p><strong>📘 Descripción:</strong><br />{torneoSeleccionado.descripcion}</p>

              {torneoSeleccionado.reglas && (
                <p><strong>📜 Reglas:</strong><br />{torneoSeleccionado.reglas}</p>
              )}

              {torneoSeleccionado.categorias && (
                <p>
                  <strong>🏷 Categorías:</strong><br />
                  {torneoSeleccionado.categorias.join(", ")}
                </p>
              )}

              {torneoSeleccionado.premios && (
                <p><strong>🏆 Premios:</strong><br />{torneoSeleccionado.premios}</p>
              )}
            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
