import axios from "axios";
import { getToken } from "../pages/Login/app/static";

const API_URL = "http://localhost:8080";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const checkoutVnPay = async (params) => {
    try {
        const response = await api.get(`/api/v1/payment/vn-pay`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching payment data:", error);
        throw error;
    }
};


