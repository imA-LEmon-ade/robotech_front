import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function ClubCompetidores() {

  const [lista, setLista] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idClub = JSON.parse(localStorage.getItem("entidad")).idClub;

  const cargar = async () => {
    const res = await axios.get(`http://localhost:8080/api/competidores/club/${idClub}`);
    setLista(res.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const aprobar = async (id) => {
    await axios.put(`http://localhost:8080/api/competidores/${id}/aprobar`);
    Swal.fire("Aprobado", "Competidor activado", "success");
    cargar();
  };

  const rechazar = async (id) => {
    await axios.put(`http://localhost:8080/api/competidores/${id}/rechazar`);
    Swal.fire("Rechazado", "Competidor rechazado", "warning");
    cargar();
  };

  const items = [
    { label: "Mis Competidores", to: "/club/competidores" },
    { label: "Mis Robots", to: "/club/robots" },
    { label: "Transferencias", to: "/club/transferencias" },
    { label: "Torneos Disponibles", to: "/club/torneos" }
  ];

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar titulo="Panel del Club" items={items} />

        <div className="flex-grow-1 p-4">
          <h2 className="fw-bold mb-3">Mis Competidores</h2>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {lista.map(c => (
                <tr key={c.idCompetidor}>
                  <td>{c.nombres} {c.apellidos}</td>
                  <td>{c.dni}</td>
                  <td>
                    {c.estadoValidacion === "PENDIENTE" && (
                      <span className="badge bg-warning">Pendiente</span>
                    )}
                    {c.estadoValidacion === "APROBADO" && (
                      <span className="badge bg-success">Aprobado</span>
                    )}
                    {c.estadoValidacion === "RECHAZADO" && (
                      <span className="badge bg-danger">Rechazado</span>
                    )}
                  </td>

                  <td>
                    {c.estadoValidacion === "PENDIENTE" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => aprobar(c.idCompetidor)}
                        >
                          Aprobar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => rechazar(c.idCompetidor)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}
