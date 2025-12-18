import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function JuezPanel() {

  const items = [
    { label: "Torneos Asignados", to: "/juez/torneos" },
    { label: "Calificar Competidores", to: "/juez/calificar" }
  ];

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar titulo="Panel Juez" items={items} />

        <div className="flex-grow-1 p-4">
          <h2 className="fw-bold">Bienvenido Juez</h2>
          <p className="text-muted">Califica en los torneos asignados.</p>
        </div>
      </div>
    </>
  );
}
