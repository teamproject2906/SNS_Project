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

export const userService = {
	// Get user profile by userId
	getUserProfile: async (userId) => {
		try {
			const response = await api.get(`/User/getUserProfile/${userId}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching user profile:", error);
			return null;
		}
	},

	// Search user by username
	searchUserByUsername: async (keyword) => {
		try {
			const response = await api.get(`/User/search/${keyword}`);
			return response.data;
		} catch (error) {
			console.error("Error searching user:", error);
			return [];
		}
	},

	// Hàm helper để tìm user từ fullname (hoặc một phần của tên)
	findUserByFullname: async (fullname) => {
		try {
			if (!fullname || fullname === "null null") return null;

			// Trích xuất một phần của tên để tìm kiếm (tránh tìm kiếm chính xác)
			const searchKeyword = fullname.split(" ")[0]; // Lấy phần đầu tiên của tên

			// Tìm kiếm user bằng keyword
			const users = await userService.searchUserByUsername(searchKeyword);

			if (!users || users.length === 0) return null;

			// Tìm người dùng phù hợp nhất với fullname (tên đầy đủ)
			const matchedUser = users.find((user) => {
				const userFullname = `${user.firstname} ${user.lastname}`;
				return userFullname === fullname;
			});

			// Trả về user phù hợp hoặc user đầu tiên tìm được
			return matchedUser || users[0];
		} catch (error) {
			console.error("Error finding user by fullname:", error);
			return null;
		}
	},

	// Hàm helper để lấy avatar từ fullname
	getAvatarFromFullname: async (fullname) => {
		try {
			const user = await userService.findUserByFullname(fullname);
			return user?.avatar || null;
		} catch (error) {
			console.error("Error getting avatar from fullname:", error);
			return null;
		}
	},

};

export default userService;
