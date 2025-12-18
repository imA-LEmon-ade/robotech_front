import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Navbar() {

  const { user, rol, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#00b3b3" }}>
      <div className="container">

        <a className="navbar-brand" href="/">
          <img src="/img/logo.jpg" alt="Logo Robotech" height="50" />
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBar">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navBar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <a className="nav-link" href="/">Inicio</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/torneos">Torneos</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/clubes">Clubes</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/competidores">Competidores</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/robots">Robots</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/rankings">Rankings</a>
            </li>


            {/* Opciones por rol */}

            {rol === "ADMINISTRADOR" && (
              <li className="nav-item">
                <a className="nav-link" href="/admin">Panel Admin</a>
              </li>
            )}

            {rol === "SUBADMINISTRADOR" && (
              <li className="nav-item">
                <a className="nav-link" href="/subadmin">Panel SubAdmin</a>
              </li>
            )}

            {rol === "COMPETIDOR" && (
              <li className="nav-item">
                <a className="nav-link" href="/competidor">Mi Perfil</a>
              </li>
            )}

            {rol === "JUEZ" && (
              <li className="nav-item">
                <a className="nav-link" href="/juez">Panel Juez</a>
              </li>
            )}

            {rol === "CLUB" && (
              <li className="nav-item">
                <a className="nav-link" href="/club">Panel Club</a>
              </li>
            )}

          </ul>

          {/* Botones derecha */}
          <div className="d-flex">

            {!rol && (
              <>
                <a className="btn btn-light me-2" href="/login">Iniciar Sesión</a>
                <a className="btn btn-warning text-white" href="/register">Regístrate</a>
              </>
            )}

            {rol && (
              <button className="btn btn-dark" onClick={logout}>
                Cerrar Sesión
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
