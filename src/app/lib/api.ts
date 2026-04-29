import axios from "axios";

const API_BASE_URL = "http://rentiqbackend.duckdns.org:7020/rentiq";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// Automatically add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response Interceptor: Global error handling + Auto Logout on 401
api.interceptors.response.use(
    (response) => {
        // Pass through successful responses
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized globally
        if (error.response?.status === 401) {
            // Clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirect to login page (force full reload to clear state)
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        // Always reject the promise so components can catch the error
        return Promise.reject(error);
    },
);
