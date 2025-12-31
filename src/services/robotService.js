import axios from "axios";

const API_URL = "http://localhost:8080/api/club/robots";

export const getMisRobots = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
