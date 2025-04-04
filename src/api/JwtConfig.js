import axios from "axios";

const Base_URL= process.env.REACT_APP_BASE_URL;

const api = axios.create({
    baseURL: Base_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle token expiration and retry request
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) throw new Error("No refresh token");

                const { data } = await axios.post(`${Base_URL}api/token/refresh/`, { refresh: refreshToken });

                // Update token in localStorage
                localStorage.setItem("access", data.access);

                // Update authorization header & retry request
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = "/sign-in";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
