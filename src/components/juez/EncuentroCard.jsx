import { Link } from "react-router-dom";

export default function EncuentroCard({ encuentro }) {
  return (
    <div className="border rounded p-4 bg-zinc-900 text-white">
      <p><b>ID:</b> {encuentro.idEncuentro}</p>
      <p><b>Categoría:</b> {encuentro.categoria}</p>
      <p><b>Tipo:</b> {encuentro.tipo}</p>
      <p><b>Coliseo:</b> {encuentro.coliseo}</p>
      <p><b>Estado:</b> {encuentro.estado}</p>

      <Link
        to={`/juez/calificar/${encuentro.idEncuentro}`}
        className={`mt-3 inline-block px-4 py-2 rounded ${
          encuentro.estado === "FINALIZADO"
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {encuentro.estado === "FINALIZADO" ? "Finalizado" : "Calificar"}
      </Link>
    </div>
  );
}
