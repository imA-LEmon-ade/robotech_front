import api from "./axiosConfig";

export const login = async (correo, contrasena) => {
  const res = await api.post("/auth/login", {
    correo,
    contrasena
  });

  const { token, usuario } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));

  return usuario;
};

export const logout = () => {
  localStorage.clear();
};

export const requestPasswordReset = async (email) => {
  return await api.post("/auth/request-password-reset", { email });
};

export const resetPassword = async (token, newPassword) => {
  return await api.post("/auth/reset-password", { token, newPassword });
};
