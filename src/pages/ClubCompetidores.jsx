import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ClubCompetidores() {

  const [lista, setLista] = useState([]);

  const entidadRaw = localStorage.getItem("entidad");
  const entidad = entidadRaw ? JSON.parse(entidadRaw) : null;
  const idClub = entidad?.idClub;

  const cargar = async () => {
    try {
      const res = await axios.get(`/api/competidores/club/${idClub}`);
      setLista(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar la lista", "error");
    }
  };

  useEffect(() => {
    if (idClub) cargar();
  }, [idClub]);

  const aprobar = async (id) => {
    await axios.put(`/api/competidores/${id}/aprobar`);
    Swal.fire("Aprobado", "Competidor activado", "success");
    cargar();
  };

  const rechazar = async (id) => {
    await axios.put(`/api/competidores/${id}/rechazar`);
    Swal.fire("Rechazado", "Competidor rechazado", "warning");
    cargar();
  };

  if (!idClub) {
    return <div>No autorizado</div>;
  }

  return (
    <>
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
    </>
  );
}
