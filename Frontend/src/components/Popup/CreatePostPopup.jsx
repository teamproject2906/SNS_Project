import { useState, useEffect } from "react";
import { FaImage, FaSmile, FaEllipsisH, FaMapMarkerAlt } from "react-icons/fa";
import { postService } from "../../services/postService";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { getToken } from "../../pages/Login/app/static";
import axios from "axios";

const CreatePostPopup = ({ isOpen, onClose, onPostCreated }) => {
	const { user } = useUser();
	const [contentText, setContentText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const defaultAvatar =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbiigxlSItMGEINLKB2wgjZ9b21BxWYei0mg&s";
	const token = getToken();

	const parseJwt = (token) => {
		if (!token) return null;
		try {
			return JSON.parse(atob(token.split(".")[1]));
		} catch (e) {
			return null;
		}
	};

	// Debug thông tin user
	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!token) return;

			try {
				const decodedToken = parseJwt(token);
				const userId = decodedToken?.userId;

				if (!userId) return;

				const response = await axios.get(
					`http://localhost:8080/User/getUserProfile/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				setUserProfile(response.data);
			} catch (error) {
				console.error("Error fetching user profile:", error);
			}
		};

		fetchUserProfile();
	}, [token]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!contentText.trim()) return;

		// Kiểm tra token trước khi gửi
		if (!token) {
			toast.error("Bạn cần đăng nhập để đăng bài");
			return;
		}

		try {
			setIsLoading(true);
			toast.info("Đang xử lý bài viết của bạn...");

			// Log thông tin user cho debug
			console.log("Posting as user:", {
				username: user?.username || user?.name || user?.sub || "",
				token: token ? "Available" : "Missing",
			});

			// Nếu có chọn ảnh
			if (selectedImage) {
				// Kiểm tra kích thước ảnh
				if (selectedImage.size > 5 * 1024 * 1024) {
					// 5MB
					toast.warning(
						"Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB"
					);
					setIsLoading(false);
					return;
				}
				// Sử dụng phương thức createPostWithImage để upload ảnh và tạo post
				await postService.createPostWithImage(contentText, selectedImage);
			} else {
				// Nếu không có ảnh, tạo post bình thường
				const postData = {
					content: contentText,
					active: true,
				};
				await postService.createPost(postData);
			}

			toast.success("Đăng bài thành công!");

			// Reset form
			setContentText("");
			setSelectedImage(null);
			setImagePreview(null);
			onClose();

			// Call the callback to refresh posts
			if (onPostCreated) {
				onPostCreated();
			}
		} catch (error) {
			console.error("Error creating post:", error);
			// Xử lý lỗi chi tiết
			let errorMessage = "Có lỗi xảy ra khi đăng bài";

			if (error.response) {
				// Lỗi từ server
				console.log("Error response data:", error.response.data);
				console.log("Error status:", error.response.status);

				if (error.response.status === 401) {
					errorMessage =
						"Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại";
				} else if (error.response.data?.message) {
					errorMessage = error.response.data.message;
				}
			} else if (error.request) {
				// Yêu cầu đã được gửi nhưng không nhận được phản hồi
				errorMessage = "Không thể kết nối đến máy chủ";
			}

			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	const userAvatar =
		userProfile?.avatar || user?.avatar || "https://i.pravatar.cc/100";
	const username = userProfile?.username || user?.sub || "User 1";

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-2xl w-full max-w-[600px] mx-auto shadow-md">
				{/* Header */}
				<div className="flex justify-between items-center p-3 border-b border-gray-200">
					<button
						onClick={onClose}
						className="text-black px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
					>
						Hủy
					</button>
					<h3 className="text-base font-semibold">Thread mới</h3>
					<div className="flex gap-3">
						<button className="p-2 hover:bg-gray-100 rounded-full">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								className="fill-gray-600"
							>
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
							</svg>
						</button>
						<button className="p-2 hover:bg-gray-100 rounded-full">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								className="fill-gray-600"
							>
								<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
							</svg>
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="p-4 flex gap-3">
					<div className="shrink-0">
						<img
							src={userAvatar}
							alt="User avatar"
							className="w-10 h-10 rounded-full object-cover"
						/>
					</div>
					<div className="flex-1">
						<div className="font-semibold text-base mb-3">{username}</div>
						<textarea
							placeholder="Có gì mới?"
							value={contentText}
							onChange={(e) => setContentText(e.target.value)}
							rows={4}
							className="w-full border-none resize-none text-base mb-2 placeholder-gray-400 focus:outline-none"
						/>
						{imagePreview && (
							<div className="mt-2">
								<img
									src={imagePreview}
									alt="Preview"
									className="max-h-32 rounded-lg"
								/>
							</div>
						)}
						<div className="flex gap-4 pt-2 border-t border-gray-100">
							<label className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors cursor-pointer">
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
								/>
								<FaImage size={18} />
							</label>
							<button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
								<FaSmile size={18} />
							</button>
							<button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
								<FaEllipsisH size={18} />
							</button>
							<button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
								<FaMapMarkerAlt size={18} />
							</button>
						</div>
					</div>
				</div>

				{/* Reply */}
				<div className="px-4 py-3 flex gap-3 items-center border-t border-gray-200">
					<div className="shrink-0">
						<img
							src={userAvatar}
							alt="Reply avatar"
							className="w-8 h-8 rounded-full object-cover"
						/>
					</div>
					<div className="flex-1">
						<input
							type="text"
							placeholder="Thêm vào thread"
							className="w-full border-none py-2 text-sm placeholder-gray-400 focus:outline-none"
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="px-4 py-3 flex justify-between items-center border-t border-gray-200">
					<div className="text-gray-600 text-xs">
						Người theo dõi bạn có thể trả lời và trích dẫn
					</div>
					<button
						onClick={handleSubmit}
						className={`px-4 py-2 rounded-full font-semibold text-white ${
							contentText.trim() && !isLoading
								? "bg-black hover:bg-gray-800"
								: "bg-gray-300 cursor-not-allowed"
						}`}
						disabled={!contentText.trim() || isLoading}
					>
						{isLoading ? "Đang đăng..." : "Đăng"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreatePostPopup;
