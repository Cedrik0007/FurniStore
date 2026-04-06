// import axios from "axios";

// // In production (Vercel), VITE_API_URL = your Render backend URL
// // In development, Vite proxy handles "/api" → localhost:5000
// const baseURL = import.meta.env.VITE_API_URL
//   ? `${import.meta.env.VITE_API_URL}/api`
//   : "/api";

// const api = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token from localStorage before every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle 401 globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

// VITE_API_URL must be set in Vercel environment variables
// e.g. https://your-app.onrender.com  (NO trailing slash)
// In local dev, Vite proxy handles /api → localhost:5000
const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "") // strip accidental trailing slash
  : "";

const baseURL = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

// Log in dev so you can confirm which URL is being used
if (import.meta.env.DEV) {
  console.log("🔗 API baseURL:", baseURL);
}

const api = axios.create({
  baseURL,
  withCredentials: false, // we use Authorization header, not cookies
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Only set Content-Type to JSON if data is NOT FormData
    // FormData needs to auto-detect and set Content-Type with proper boundary
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;


