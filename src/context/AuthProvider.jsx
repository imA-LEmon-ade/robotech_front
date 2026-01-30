import { useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("usuario");
    try { return u ? JSON.parse(u) : null; }
    catch { return null; }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [rol, setRol] = useState(localStorage.getItem("rol") || "");

  const [entidad, setEntidad] = useState(() => {
    const e = localStorage.getItem("entidad");
    try { return e ? JSON.parse(e) : null; }
    catch { return null; }
  });

  // LOGIN
  const login = (data) => {

    const normalizedUser = (() => {
      if (data.rol === "CLUB_COMPETIDOR" && data.usuario?.club && data.usuario?.competidor) {
        const club = data.usuario.club;
        const competidor = data.usuario.competidor;
        return { ...club, ...competidor, club, competidor };
      }
      return data.usuario;
    })();

    setUser(normalizedUser);
    setToken(data.token);
    setRol(data.rol);
    setEntidad(data.entidad);

    localStorage.setItem("usuario", JSON.stringify(normalizedUser));
    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);
    localStorage.setItem("entidad", JSON.stringify(data.entidad));
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken("");
    setRol("");
    setEntidad(null);

    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, token, rol, entidad, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
