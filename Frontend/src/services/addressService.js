import axios from 'axios';
import { getToken } from "../pages/Login/app/static";

const API_URL = 'http://localhost:8080/api/v1/addresses';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
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

export const addressService = {
  // Get all addresses for a specific user
  getAllAddresses: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  // Get default address for a user
  getDefaultAddress: async (userId) => {
    const response = await api.get(`/user/${userId}/default`);
    return response.data;
  },

  // Add a new address
  addAddress: async (addressData) => {
    // Transform the frontend data to match backend DTO
    const response = await api.post("", addressData);
    return response.data;
  },

  // Update an existing address
  updateAddress: async (addressId, addressData) => {
    // Transform the frontend data to match backend DTO
    const response = await api.put(`/${addressId}`, addressData);
    return response.data;
  },

  // Delete an address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/${addressId}`);
    return response.data;
  },

}; 