import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/ClubPanel.css";

export default function ClubPanel() {

  const items = [
  { label: "Mis Competidores", to: "/club/competidores" },
  { label: "Mis Robots", to: "/club/robots" },
  { label: "Transferencias", to: "/club/transferencias" },
  { label: "Torneos Disponibles", to: "/club/torneos" }
];

  const [club, setClub] = useState(null);
  const [codigos, setCodigos] = useState([]);

  const entidad = JSON.parse(localStorage.getItem("entidad"));
  const idClub = entidad?.idClub;

  useEffect(() => {
    if (idClub) {
      cargarClub();
      cargarCodigos();
    }
  }, [idClub]);

  // ============================
  //     CARGAR DATOS DEL CLUB
  // ============================
  const cargarClub = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/clubes/${idClub}`
      );
      setClub(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar la información del club", "error");
    }
  };

  // ============================
  //     CARGAR CÓDIGOS
  // ============================
  const cargarCodigos = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/codigos/club/${idClub}`
      );
      setCodigos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los códigos", "error");
    }
  };

  // ============================
  //     GENERAR CÓDIGO
  // ============================
  const generarCodigo = async () => {
    const { value: valores } = await Swal.fire({
      title: "Generar Código de Registro",
      html: `
        <label>Horas de Expiración</label>
        <input id="horas" type="number" class="swal2-input" value="24">

        <label>Límite de Uso</label>
        <input id="limite" type="number" class="swal2-input" value="1">
      `,
      showCancelButton: true,
      confirmButtonText: "Generar",
      preConfirm: () => ({
        horas: document.getElementById("horas").value,
        limite: document.getElementById("limite").value
      })
    });

    if (!valores) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/codigos/${idClub}/generar`,
        {
          horasExpiracion: Number(valores.horas),
          limiteUso: Number(valores.limite)
        }
      );

      Swal.fire("Código generado", `Código: ${res.data.codigo}`, "success");
      cargarCodigos();
    } catch {
      Swal.fire("Error", "No se pudo generar el código", "error");
    }
  };

  if (!club) return <div>Cargando...</div>;

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar titulo="Panel del Club" items={items} />

        <div className="flex-grow-1 p-4">

          {/* PERFIL DEL CLUB */}
          <div className="club-card shadow">
            <img
              src={club.logoUrl || "/default-club.png"}
              alt="logo"
              className="club-avatar"
            />

            <h2 className="club-name">{club.nombre}</h2>
            <p className="club-desc">{club.descripcion || "Club de robótica"}</p>

            <div className="club-stats">
              <div>
                <h4>{club.totalCompetidores}</h4>
                <span>Competidores</span>
              </div>

              <div>
                <h4>{club.totalRobots}</h4>
                <span>Robots</span>
              </div>

              <div>
                <h4>{codigos.length}</h4>
                <span>Códigos</span>
              </div>
            </div>

            <button className="btn-generate" onClick={generarCodigo}>
              Generar Código de Registro
            </button>
          </div>

          {/* LISTA DE CÓDIGOS */}
          <h4 className="fw-bold mt-5">Códigos Generados</h4>

          <div className="codigos-grid mt-3">
            {codigos.length === 0 ? (
              <p className="text-muted">No hay códigos generados</p>
            ) : (
              codigos.map(c => (
                <div key={c.codigo} className="codigo-card shadow-sm">
                  <h5>{c.codigo}</h5>

                  <p><strong>Creado:</strong> {new Date(c.creadoEn).toLocaleString()}</p>
                  <p><strong>Expira:</strong> {new Date(c.expiraEn).toLocaleString()}</p>
                  <p><strong>Usos:</strong> {c.usosActuales}/{c.limiteUso}</p>

                  <span className={
                    c.usado
                      ? "badge bg-danger"
                      : new Date(c.expiraEn) < new Date()
                      ? "badge bg-secondary"
                      : "badge bg-success"
                  }>
                    {c.usado ? "Usado" : new Date(c.expiraEn) < new Date() ? "Expirado" : "Vigente"}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}
