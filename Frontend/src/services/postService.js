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

export const postService = {
	// Create a new post
	createPost: async (postData) => {
		const response = await api.post("/social/api/post/createPost", postData);
		return response.data;
	},

	// Get all posts
	getAllPosts: async () => {
		const response = await api.get("/social/api/post/getAllPostActive");
		return response.data;
	},

	// Get post by id
	getPostById: async (postId) => {
		const response = await api.get(`/social/api/post/getPostById/${postId}`);
		return response.data;
	},

	// Update a post
	updatePost: async (postId, postData) => {
		const response = await api.put(
			`/social/api/post/updatePost/${postId}`,
			postData
		);
		return response.data;
	},

	// Deactivate a post
	deactivatePost: async (postId, postData) => {
		const response = await api.patch(
			`/social/api/post/deactivatePost/${postId}`,
			postData
		);
		return response.data;
	},

	searchPosts: async (query) => {
		try {
			const response = await api.get(`/social/api/post/searchPost/${query}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Like/Unlike a post (Backend chỉ có một endpoint xử lý cả like và unlike)
	likePost: async (postId) => {
		try {
			const response = await api.post(`/social/api/post/likePost/${postId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Unlike a post (Sử dụng cùng endpoint với likePost vì backend dùng toggle)
	unlikePost: async (postId) => {
		try {
			// Backend sử dụng cùng một endpoint cho cả like và unlike (toggle)
			return await postService.likePost(postId);
		} catch (error) {
			throw error;
		}
	},

	// Get users who liked a post
	getPostLikers: async (postId) => {
		try {
			// Không có API riêng cho việc lấy danh sách người like, lấy từ post
			const response = await postService.getPostById(postId);
			if (response && response.userLikes) {
				// Chuyển đổi dữ liệu UserLikeDTO thành format phù hợp cho UI
				return response.userLikes.map((like) => ({
					id: like.userID,
					username: like.userName || "User " + like.userID, // Backend có thể không trả về userName
					avatar:
						like.userAvatar ||
						`https://i.pravatar.cc/100?img=${(like.userID % 10) + 1}`,
				}));
			}
			return [];
		} catch (error) {
			console.error("Error fetching post likers:", error);
			return [];
		}
	},

	// Check if current user has liked a post
	checkLikeStatus: async (postId) => {
		try {
			// Không có API riêng cho việc kiểm tra like status, lấy từ post
			const response = await postService.getPostById(postId);

			if (!response) return undefined;

			// Giải mã token để lấy ID người dùng hiện tại
			const token = getToken();
			if (!token)
				return { isLiked: false, likesCount: response.totalLiked || 0 };

			const decodedToken = JSON.parse(atob(token.split(".")[1]));
			const currentUserId = decodedToken?.userId;

			if (!currentUserId)
				return { isLiked: false, likesCount: response.totalLiked || 0 };

			// Kiểm tra xem user hiện tại có trong danh sách userLikes không
			const isLiked =
				response.userLikes &&
				response.userLikes.some((like) => like.userID === currentUserId);

			return {
				isLiked: isLiked || false,
				likesCount: response.totalLiked || 0,
			};
		} catch (error) {
			console.error("Error checking like status:", error);
			return undefined;
		}
	},
};

export default postService;
