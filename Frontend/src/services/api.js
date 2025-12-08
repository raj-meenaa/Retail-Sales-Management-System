import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const salesAPI = {
  getSales: async (params) => {
    const response = await api.get("/sales", { params });
    return response.data;
  },

  getFilterOptions: async () => {
    const response = await api.get("/filter-options");
    return response.data;
  },

  getStatistics: async (params) => {
    const response = await api.get("/statistics", { params });
    return response.data;
  },
};

export default api;
