import axios from "axios";
import { clearAuthSession, getAuthToken } from "./auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://client-registry-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token && !config.url?.includes("/auth/login")) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(error);
  },
);

export const jobService = {
  // Create new job
  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get("/jobs");
    return response.data;
  },

  // Update job
  updateJob: async (id, updates) => {
    const response = await api.patch(`/jobs/${id}`, updates);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
  trackJob: async (jobId) => {
    const response = await api.get(`/jobs/track/${jobId}`);
    return response.data;
  },

  getReceipt: async (id) => {
    const response = await api.get(`/jobs/${id}/receipt`);
    return response.data;
  },
};

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};

export default api;
