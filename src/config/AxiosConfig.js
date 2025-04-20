import axios from "axios";

const baseURL = "http://127.0.0.1:8000/";

const AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
});

// Interceptor để thêm Authorization vào request
AxiosInstance.interceptors.request.use(
    async (config) => {
        const token = await localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default AxiosInstance;
