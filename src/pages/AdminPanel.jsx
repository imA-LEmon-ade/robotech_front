import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminPanel() {

  const items = [
    { label: "Gestionar Usuarios", to: "/admin/usuarios" },
    { label: "Gestionar Torneos", to: "/admin/torneos" },
    { label: "Gestionar Jueces", to: "/admin/jueces" },
    { label: "Gestionar Clubes", to: "/admin/clubes" },
    { label: "Gestionar Subadministrador", to: "/admin/subadmin" },
    { label: "Gestionar robots", to: "/admin/robots" }
  ];

  return (
    <>
      <Navbar />
      
      <div className="d-flex">
        <Sidebar titulo="Panel Admin" items={items} />

        <div className="flex-grow-1 p-4">
          <h2 className="fw-bold">Bienvenido, Administrador</h2>
          <p className="text-muted">Aquí puedes gestionar toda la plataforma.</p>
        </div>
      </div>
    </>
  );
}

