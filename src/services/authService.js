import axios from "axios";

const API_URL = "http://localhost:8080/api/usuarios";

export async function login(correo, contrasena) {
  try {
    const res = await axios.post(`${API_URL}/login`, {
      correo,
      contrasena,
    });

    return res.data; // usuario del backend
  } catch (error) {
    throw error.response?.data || "Error al iniciar sesión";
  }
}
