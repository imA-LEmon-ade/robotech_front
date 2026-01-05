import { useEffect, useMemo, useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  listarRobotsAdmin,
  listarClubesAdmin
} from "../../services/adminRobotsService";

export default function AdminRobots() {
  const [robots, setRobots] = useState([]);
  const [clubes, setClubes] = useState([]);

  const [filtros, setFiltros] = useState({
    nombre: "",
    categoria: "",
    idClub: ""
  });

  const [loading, setLoading] = useState(false);

  // Convierte "" -> null (para que backend no filtre)
  const filtrosNormalizados = useMemo(() => {
    const nombre = filtros.nombre?.trim();
    return {
      nombre: nombre ? nombre : null,
      categoria: filtros.categoria ? filtros.categoria : null,
      idClub: filtros.idClub ? filtros.idClub : null
    };
  }, [filtros]);

  const cargarRobots = useCallback(async (params) => {
    try {
      setLoading(true);
      const data = await listarRobotsAdmin(params);
      setRobots(data);
    } catch (err) {
      Swal.fire("Error", err?.response?.data ?? "No se pudieron cargar los robots", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar clubes una sola vez
  useEffect(() => {
    listarClubesAdmin()
      .then(setClubes)
      .catch(() => Swal.fire("Error", "No se pudieron cargar los clubes", "error"));
  }, []);

  // Carga inicial: trae todos
  useEffect(() => {
    cargarRobots({ nombre: null, categoria: null, idClub: null });
  }, [cargarRobots]);

  // Debounce SOLO para nombre
  useEffect(() => {
    const t = setTimeout(() => {
      cargarRobots(filtrosNormalizados);
    }, 400);

    return () => clearTimeout(t);
  }, [filtros.nombre, filtrosNormalizados, cargarRobots]);

  // Filtros inmediatos para selects (categoria / club)
  useEffect(() => {
    cargarRobots(filtrosNormalizados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.categoria, filtros.idClub]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: "", categoria: "", idClub: "" });
  };

  return (
    <>
      <h3 className="fw-bold mb-4">Gestionar Robots</h3>

      {/* FILTROS */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Buscar por nombre (filtra al escribir)"
              name="nombre"
              value={filtros.nombre}
              onChange={onChange}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="categoria"
              value={filtros.categoria}
              onChange={onChange}
            >
              <option value="">Todas las categorías</option>
              <option value="MINISUMO">MINISUMO</option>
              <option value="MICROSUMO">MICROSUMO</option>
              <option value="MEGASUMO">MEGASUMO</option>
              <option value="DRONE">DRONE</option>
              <option value="FOLLOWER">FOLLOWER</option>
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="idClub"
              value={filtros.idClub}
              onChange={onChange}
            >
              <option value="">Todos los clubes</option>
              {clubes.map((c) => (
                <option key={c.idClub} value={c.idClub}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          {/* Ya no es necesario, pero útil para forzar refresh */}
          <button
            className="btn btn-primary"
            onClick={() => cargarRobots(filtrosNormalizados)}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Refrescar"}
          </button>

          <button className="btn btn-outline-secondary" onClick={limpiarFiltros} disabled={loading}>
            Limpiar
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="card shadow-sm">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Nickname</th>
              <th>Categoría</th>
              <th>Competidor</th>
              <th>Club</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Cargando robots...
                </td>
              </tr>
            ) : robots.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay robots registrados
                </td>
              </tr>
            ) : (
              robots.map((r) => (
                <tr key={r.idRobot}>
                  <td>{r.idRobot}</td>
                  <td>{r.nombre}</td>
                  <td>{r.nickname}</td>
                  <td>{r.categoria}</td>
                  <td>{r.competidor}</td>
                  <td>{r.club}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
