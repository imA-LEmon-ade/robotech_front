import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import api from "../../services/axiosConfig";

export default function ClubCompetidores() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  const entidadRaw = localStorage.getItem("entidad");
  const entidad = entidadRaw ? JSON.parse(entidadRaw) : null;
  const idClub = entidad?.idClub;

  // ============================
  // CARGAR COMPETIDORES
  // ============================
  const cargar = useCallback(async () => {
    if (!idClub) return;

    try {
      setLoading(true);
      const res = await api.get(`/api/competidores/club/${idClub}`);
      setLista(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar la lista", "error");
    } finally {
      setLoading(false);
    }
  }, [idClub]);

  useEffect(() => {
    cargar();
  }, [cargar, idClub]);

  // ============================
  // ACCIONES
  // ============================
  const aprobar = useCallback(
    async (id) => {
      try {
        await api.put(`/api/competidores/${id}/aprobar`);
        Swal.fire("Aprobado", "Competidor activado", "success");
        cargar();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo aprobar", "error");
      }
    },
    [cargar]
  );

  const rechazar = useCallback(
    async (id) => {
      try {
        await api.put(`/api/competidores/${id}/rechazar`);
        Swal.fire("Rechazado", "Competidor rechazado", "warning");
        cargar();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo rechazar", "error");
      }
    },
    [cargar]
  );

  // ============================
  // GUARDAS
  // ============================
  if (!idClub) {
    return <div className="alert alert-danger">No autorizado</div>;
  }

  // ============================
  // RENDER
  // ============================
  return (
    <>
      <h2 className="fw-bold mb-3">Mis Competidores</h2>

      {loading && <div className="text-muted">Cargando competidores...</div>}

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
          {lista.length === 0 && !loading ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No hay competidores registrados
              </td>
            </tr>
          ) : (
            lista.map((c) => (
              <tr key={c.idCompetidor}>
                <td>
                  {c.nombres} {c.apellidos}
                </td>
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
                        disabled={loading}
                      >
                        Aprobar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => rechazar(c.idCompetidor)}
                        disabled={loading}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
