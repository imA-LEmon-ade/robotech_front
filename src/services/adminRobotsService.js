import api from "./axiosConfig";

export const listarRobotsAdmin = async (params) => {
  const res = await api.get("/admin/robots", { params });
  return res.data;
};

export const listarClubesAdmin = async () => {
  const res = await api.get("/admin/clubes", { params: { page: 0, size: 1000 } });
  return res.data?.content || [];
};

