import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status == 400) {
            try {
                const refreshToken = localStorage.getItem("refresh");
                const { data } = await axios.post(`${BASE_URL}/token/refresh/`, { refresh: refreshToken });
                localStorage.setItem("access", data.access);
                return api(error.config); // Retry failed request with new token
            } catch {
                localStorage.clear();
                window.location.href = "/sign-in";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
