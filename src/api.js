import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://client-registry-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

  // Track job by jobId
  trackJob: async (jobId) => {
    const response = await api.get(`/jobs/track/${jobId}`);
    return response.data;
  },

  // Fetch receipt data by mongo id or job id
  getReceipt: async (id) => {
    const response = await api.get(`/jobs/${id}/receipt`);
    return response.data;
  },
};

export default api;
