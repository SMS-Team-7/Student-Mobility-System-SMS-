import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  "https://team-7-api.onrender.com";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: request interceptor to attach auth token if needed later
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
