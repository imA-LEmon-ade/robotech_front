import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function SubAdminPanel() {

  const items = [
    { label: "Registrar Club", to: "/subadmin/registrar-club" },
    { label: "Registrar Competidor", to: "/subadmin/registrar-comp" },
    { label: "Registrar Juez", to: "/subadmin/registrar-juez" },
    { label: "Crear Torneo", to: "/subadmin/torneos" }
  ];

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar titulo="Panel SubAdmin" items={items} />

        <div className="flex-grow-1 p-4">
          <h2 className="fw-bold">Bienvenido, SubAdministrador</h2>
          <p className="text-muted">
            Gestiona registros y creación de torneos.
          </p>
        </div>
      </div>
    </>
  );
}
