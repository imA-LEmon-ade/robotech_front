import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FaExchangeAlt, FaStore, FaUserTag, FaInbox, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import api from "../../services/axiosConfig";

export default function ClubTransferencias() {
  const storedUser = localStorage.getItem("usuario");
  const entidad = storedUser ? JSON.parse(storedUser) : null;
  const idClub = entidad?.idClub;

  const [competidores, setCompetidores] = useState([]);
  const [mercado, setMercado] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [idCompetidor, setIdCompetidor] = useState("");
  const [precio, setPrecio] = useState("");

  const competidoresAprobados = useMemo(
    () => competidores.filter(c => c.estadoValidacion === "APROBADO" || c.estadoValidacion === "VALIDADO"),
    [competidores]
  );

  const cargarTodo = async () => {
    if (!idClub) return;
    setLoading(true);
    try {
      const [resMercado, resPublicaciones, resSolicitudes, resCompetidores] = await Promise.all([
        api.get("/club/transferencias/mercado"),
        api.get("/club/transferencias/mis-publicaciones"),
        api.get("/club/transferencias/mis-solicitudes"),
        api.get(`/competidores/club/${idClub}`)
      ]);
      setMercado(Array.isArray(resMercado.data) ? resMercado.data : []);
      setPublicaciones(Array.isArray(resPublicaciones.data) ? resPublicaciones.data : []);
      setSolicitudes(Array.isArray(resSolicitudes.data) ? resSolicitudes.data : []);
      setCompetidores(Array.isArray(resCompetidores.data) ? resCompetidores.data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar la información de transferencias", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, [idClub]);

  const publicar = async () => {
    if (!idCompetidor) {
      return Swal.fire("Atención", "Selecciona un competidor", "warning");
    }
    try {
      await api.post("/club/transferencias/publicar", {
        idCompetidor,
        precio: precio ? Number(precio) : null
      });
      setIdCompetidor("");
      setPrecio("");
      Swal.fire("Publicado", "Competidor puesto en venta", "success");
      cargarTodo();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "No se pudo publicar";
      Swal.fire("Error", msg, "error");
    }
  };

  const solicitar = async (id) => {
    try {
      await api.post(`/club/transferencias/${id}/solicitar`);
      Swal.fire("Solicitud enviada", "Esperando aprobación del club origen", "success");
      cargarTodo();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "No se pudo solicitar";
      Swal.fire("Error", msg, "error");
    }
  };

  const aprobar = async (id) => {
    try {
      await api.post(`/club/transferencias/${id}/aprobar`);
      Swal.fire("Aprobado", "Competidor transferido con éxito", "success");
      cargarTodo();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "No se pudo aprobar";
      Swal.fire("Error", msg, "error");
    }
  };

  const rechazar = async (id) => {
    try {
      await api.post(`/club/transferencias/${id}/rechazar`);
      Swal.fire("Rechazado", "Solicitud rechazada", "info");
      cargarTodo();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "No se pudo rechazar";
      Swal.fire("Error", msg, "error");
    }
  };

  const cancelar = async (id) => {
    try {
      await api.post(`/club/transferencias/${id}/cancelar`);
      Swal.fire("Cancelado", "Publicación cancelada", "info");
      cargarTodo();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "No se pudo cancelar";
      Swal.fire("Error", msg, "error");
    }
  };

  const badgeByEstado = (estado) => {
    switch (estado) {
      case "EN_VENTA":
        return "bg-success-subtle text-success border border-success";
      case "PENDIENTE":
        return "bg-warning-subtle text-warning-emphasis border border-warning";
      case "APROBADA":
        return "bg-primary-subtle text-primary border border-primary";
      case "RECHAZADA":
      case "CANCELADA":
        return "bg-danger-subtle text-danger border border-danger";
      default:
        return "bg-light text-secondary border border-secondary";
    }
  };

  if (!idClub) {
    return <div className="alert alert-danger m-4">Error: No se identificó el club.</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0 text-dark">
            <FaExchangeAlt className="me-2 text-primary" />
            Transferencias de Competidores
          </h2>
          <p className="text-muted mb-0">Publica, solicita y aprueba transferencias entre clubes</p>
        </div>
      </div>

      {/* Publicar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-0 fw-bold">
          <FaUserTag className="me-2 text-info" />
          Publicar competidor
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label fw-bold small">Competidor</label>
              <select className="form-select" value={idCompetidor} onChange={(e) => setIdCompetidor(e.target.value)}>
                <option value="">Selecciona un competidor...</option>
                {competidoresAprobados.map((c) => (
                  <option key={c.idCompetidor} value={c.idCompetidor}>
                    {c.nombres} {c.apellidos} - {c.dni}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold small">Precio (opcional)</label>
              <input
                type="number"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Venta simbólica"
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={publicar} disabled={loading}>
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Listados */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 fw-bold">
              <FaStore className="me-2 text-success" />
              Mercado
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">Cargando...</div>
              ) : mercado.length === 0 ? (
                <div className="text-muted">No hay competidores en venta.</div>
              ) : (
                <div className="list-group">
                  {mercado.map((t) => (
                    <div key={t.idTransferencia} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{t.nombreCompetidor}</div>
                        <div className="small text-muted">{t.nombreClubOrigen}</div>
                        <span className={`badge rounded-pill ${badgeByEstado(t.estado)}`}>{t.estado}</span>
                      </div>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => solicitar(t.idTransferencia)}>
                        Solicitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 fw-bold">
              <FaInbox className="me-2 text-warning" />
              Mis publicaciones
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">Cargando...</div>
              ) : publicaciones.length === 0 ? (
                <div className="text-muted">No tienes publicaciones.</div>
              ) : (
                <div className="list-group">
                  {publicaciones.map((t) => (
                    <div key={t.idTransferencia} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{t.nombreCompetidor}</div>
                        <div className="small text-muted">Destino: {t.nombreClubDestino || "Sin solicitud"}</div>
                        <span className={`badge rounded-pill ${badgeByEstado(t.estado)}`}>{t.estado}</span>
                      </div>
                      <div className="btn-group">
                        {t.estado === "PENDIENTE" && (
                          <>
                            <button className="btn btn-outline-success btn-sm" onClick={() => aprobar(t.idTransferencia)}>
                              <FaCheckCircle />
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => rechazar(t.idTransferencia)}>
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        {(t.estado === "EN_VENTA" || t.estado === "PENDIENTE") && (
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => cancelar(t.idTransferencia)}>
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 fw-bold">
              Mis solicitudes
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">Cargando...</div>
              ) : solicitudes.length === 0 ? (
                <div className="text-muted">No has solicitado transferencias.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Competidor</th>
                        <th>Club origen</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.map((t) => (
                        <tr key={t.idTransferencia}>
                          <td>{t.nombreCompetidor}</td>
                          <td>{t.nombreClubOrigen}</td>
                          <td>
                            <span className={`badge rounded-pill ${badgeByEstado(t.estado)}`}>{t.estado}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
