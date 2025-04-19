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

	// Upload ảnh và tạo bài viết thông qua backend
	createPostWithImage: async (content, imageFile) => {
		try {
			console.log("Creating post with image using backend API...");

			// Tạo FormData chứa thông tin bài đăng và file ảnh
			const formData = new FormData();
			formData.append("file", imageFile);
			formData.append("content", content);

			// Gọi API backend để upload ảnh và tạo bài đăng
			const response = await api.post(
				"/social/api/post/createPostWithImage",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			console.log("Post created successfully with image via backend");
			return response.data;
		} catch (error) {
			console.error("Error creating post with image:", error);
			if (error.response) {
				console.error("Error response:", error.response.data);
				console.error("Status code:", error.response.status);
			}
			throw error;
		}
	},

	getPostsByUserId: async (userId) => {
		const response = await api.get(`/social/api/post/getPostsByUid/${userId}`);
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

	// Update post with image
	updatePostWithImage: async (postId, content, imageFile) => {
		try {
			console.log("Updating post with image, postId:", postId);

			// Tạo FormData chứa thông tin bài đăng và file ảnh (nếu có)
			const formData = new FormData();
			formData.append("content", content);

			// Chỉ thêm file vào formData nếu có chọn ảnh mới
			if (imageFile) {
				formData.append("file", imageFile);
			}

			// Gọi API backend để cập nhật bài đăng
			const response = await api.put(
				`/social/api/post/updatePostWithImage/${postId}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			console.log("Post updated successfully with image");
			return response.data;
		} catch (error) {
			console.error("Error updating post with image:", error);
			if (error.response) {
				console.error("Error response:", error.response.data);
				console.error("Status code:", error.response.status);
			}
			throw error;
		}
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
			// Nếu query trống hoặc undefined, trả về mảng rỗng
			if (!query || query.trim() === "") {
				return [];
			}

			const response = await api.get(`/social/api/post/searchPost/${query}`);
			return response.data;
		} catch (error) {
			console.error("Error searching posts:", error);
			// Trả về mảng rỗng thay vì throw error để ngăn crash ứng dụng
			return [];
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
				return response.userLikes
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

	// Trả về một số bài đăng ngẫu nhiên
	getRandomPosts: async () => {
		try {
			// Nếu API chưa có endpoint cho random posts, sử dụng getAllPosts thay thế
			const response = await api.get("/social/api/post/getAllPostActive");

			// Nếu có ít hơn 5 bài viết, trả về tất cả
			if (response.data.length <= 5) {
				return response.data;
			}

			// Nếu có nhiều hơn 5 bài viết, trộn mảng và trả về 5 bài viết
			const shuffled = [...response.data].sort(() => 0.5 - Math.random());
			return shuffled.slice(0, 5);
		} catch (error) {
			console.error("Error fetching random posts:", error);
			return [];
		}
	},
};

export default postService;
