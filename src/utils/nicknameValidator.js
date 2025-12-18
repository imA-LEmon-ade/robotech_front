const PALABRAS_PROHIBIDAS = [
  "mierda", "puta", "puto", "perra", "maricon", "maricón",
  "pendejo", "coño", "verga", "ctm", "conchatumadre",
  "culero", "chingar", "huevon", "huevón", "idiota",
  "imbecil", "estupido", "estúpido"
];

// Normaliza para evitar trucos tipo m13rd4, m!erd@, etc.
function normalizar(texto) {
  return texto
    .toLowerCase()
    .replace(/[áà]/g, "a")
    .replace(/[éè]/g, "e")
    .replace(/[íì]/g, "i")
    .replace(/[óò]/g, "o")
    .replace(/[úù]/g, "u")
    .replace(/[^a-z0-9]/g, "");
}

export function nicknameEsValido(nickname) {
  const limpio = normalizar(nickname);

  return !PALABRAS_PROHIBIDAS.some((p) =>
    limpio.includes(normalizar(p))
  );
}
