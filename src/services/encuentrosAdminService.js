import api from "./axiosConfig";

export const listarCategoriasEncuentros = async () => {
  const res = await api.get("/admin/encuentros/categorias", { params: { page: 0, size: 1000 } });
  return res.data?.content || res.data;
};

export const generarEncuentros = async (data) => {
  const res = await api.post("/admin/encuentros/generar", data);
  return res.data;
};
