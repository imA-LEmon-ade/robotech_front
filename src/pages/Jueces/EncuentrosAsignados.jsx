
import { useEffect, useState } from "react";
import api from "../../services/api";
import EncuentroCard from "../../components/juez/EncuentroCard";

export default function EncuentrosAsignados() {
  const [encuentros, setEncuentros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/juez/encuentros")
      .then(res => setEncuentros(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando encuentros...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Encuentros Asignados</h1>

      {encuentros.length === 0 && (
        <p>No tienes encuentros asignados.</p>
      )}

      <div className="grid gap-4">
        {encuentros.map(encuentro => (
          <EncuentroCard key={encuentro.idEncuentro} encuentro={encuentro} />
        ))}
      </div>
    </div>
  );
}
