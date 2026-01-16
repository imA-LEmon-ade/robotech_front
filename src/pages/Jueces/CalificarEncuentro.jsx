import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";

export default function CalificarEncuentro() {
  const { idEncuentro } = useParams();
  const navigate = useNavigate();

  const [encuentro, setEncuentro] = useState(null);
  const [puntajes, setPuntajes] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔹 cargar encuentros del juez y buscar el correcto
  useEffect(() => {
    api.get("/juez/encuentros")
      .then(res => {
        const enc = res.data.find(e => e.idEncuentro === idEncuentro);
        setEncuentro(enc);
      })
      .catch(() => {
        Swal.fire("Error", "No se pudo cargar el encuentro", "error");
      })
      .finally(() => setLoading(false));
  }, [idEncuentro]);

  if (loading) return <p className="text-white">Cargando...</p>;
  if (!encuentro) return <p className="text-red-500">Encuentro no encontrado</p>;

  // 🏆 ganador automático por mayor puntaje
  const ganadorId = Object.entries(puntajes)
    .filter(([_, v]) => v !== "" && v !== null)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // 💾 guardar resultado
  const guardarResultado = async () => {

    // validar puntajes completos
    for (const p of encuentro.participantes) {
      const val = puntajes[p.idReferencia];
      if (val === undefined || val === "") {
        Swal.fire("Atención", "Todos los participantes deben tener puntaje", "warning");
        return;
      }
      if (val < 0 || val > 100) {
        Swal.fire("Error", "El puntaje debe estar entre 0 y 100", "error");
        return;
      }
    }

    try {
      await api.post(
        `/juez/encuentros/${idEncuentro}/resultado`,
        {
          calificaciones: encuentro.participantes.map(p => ({
            idReferencia: p.idReferencia,
            calificacion: Number(puntajes[p.idReferencia])
          }))
        }
      );

      Swal.fire("✔ Resultado guardado", "El encuentro fue finalizado", "success");
      navigate("/juez/encuentros");

    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data ?? "No se pudo guardar el resultado",
        "error"
      );
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Calificar Encuentro {idEncuentro}
      </h1>

      <div className="space-y-4 max-w-lg">
        {encuentro.participantes.map(p => {
          const esGanador = ganadorId === p.idReferencia;

          return (
            <div
              key={p.idReferencia}
              className={`flex items-center justify-between p-4 rounded border
                ${esGanador ? "border-emerald-500 bg-emerald-900/30" : "border-zinc-700"}
              `}
            >
              <div>
                <p className="font-semibold text-lg">
                  {p.nombre ?? p.idReferencia}
                </p>
                {esGanador && (
                  <span className="text-emerald-400 font-bold">🏆 Ganador</span>
                )}
              </div>

              <input
                type="number"
                min={0}
                max={100}
                value={puntajes[p.idReferencia] ?? ""}
                placeholder="0–100"
                className="w-24 p-2 text-black rounded"
                onChange={e =>
                  setPuntajes({
                    ...puntajes,
                    [p.idReferencia]: Number(e.target.value)
                  })
                }
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={guardarResultado}
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded font-bold"
      >
        Guardar Resultado
      </button>
    </div>
  );
}
