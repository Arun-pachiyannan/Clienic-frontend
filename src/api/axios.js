import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://anan-clinic-backend.onrender.com/api",
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("anan_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, the backend returns 401 - log the user
// out locally so the UI doesn't sit in a broken "logged in" state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("anan_token");
      localStorage.removeItem("anan_user");
    }
    return Promise.reject(error);
  }
);

export default api;