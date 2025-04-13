import React, { useState, useEffect, useRef } from "react";
import {
	FaHeart,
	FaRegComment,
	FaPaperPlane,
	FaEdit,
	FaTrash,
	FaRegHeart,
	FaImage,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { BsClock, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { postService } from "../../../../services/postService";
import { commentService } from "../../../../services/commentService";
import { getUserInfo, getToken } from "../../../../pages/Login/app/static";
import { useUser } from "../../../../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const MAX_VISIBLE_REPLIES = 2;

const getTimeAgo = (timestamp) => {
	const seconds = Math.floor((Date.now() - timestamp) / 1000);
	const minutes = Math.floor(seconds / 60);
	return `${minutes === 0 ? 1 : minutes} phút trước`;
};

// Component riêng để hiển thị một bình luận và các trả lời của nó
const CommentItem = ({
	comment,
	level = 0,
	userAvatar,
	onReply,
	replyingToId,
	replyText,
	setReplyText,
	onPostReply,
	isSubmitting,
	onEditComment,
	onDeleteComment,
}) => {
	// Tạo class cho thụt lề dựa trên level
	const getIndentClass = () => {
		if (level === 0) return ""; // Comment gốc không cần thụt lề
		if (level === 1) return "ml-6 pl-3 border-l-2 border-blue-200";
		if (level === 2) return "ml-4 pl-3 border-l-2 border-green-200";
		return "ml-2 pl-3 border-l-2 border-purple-200"; // Level > 2
	};

	return (
		<div
			className={`flex flex-col gap-2 ${
				level > 0 ? `mt-2 ${getIndentClass()}` : "mb-4 border-b pb-2"
			}`}
		>
			{/* Bình luận chính */}
			<div className="flex items-start gap-3">
				<div className="w-8 h-8 rounded-full overflow-hidden">
					<img
						src={
							comment.user?.avatar ||
							userAvatar ||
							`https://i.pravatar.cc/100?img=${(comment.id % 10) + 1}`
						}
						alt="User"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="flex-1">
					<div
						className={`${
							level === 0
								? "bg-gray-100"
								: level === 1
								? "bg-blue-50"
								: level === 2
								? "bg-green-50"
								: "bg-purple-50"
						} p-3 rounded-xl`}
					>
						<h4 className="font-semibold text-sm flex justify-between">
							<span>
								{comment.user === "null null"
									? "(Người dùng chưa đặt tên)"
									: comment.user}
							</span>
							<div className="flex gap-2">
								<button
									onClick={() => onEditComment(comment)}
									className="text-blue-500 hover:text-blue-700"
								>
									<FaEdit className="w-3.5 h-3.5" />
								</button>
								<button
									onClick={() => onDeleteComment(comment.id)}
									className="text-red-500 hover:text-red-700"
								>
									<FaTrash className="w-3.5 h-3.5" />
								</button>
							</div>
						</h4>
						{comment.replyingTo && (
							<div className="text-blue-600 text-xs font-semibold mb-1 bg-blue-50 inline-block px-2 py-1 rounded">
								Trả lời @{comment.replyingTo}
							</div>
						)}
						<p className="text-sm mt-1">
							{comment.content && comment.content.startsWith("@")
								? comment.content.replace(/^@\S+\s/, "") // Loại bỏ @username ở đầu
								: comment.content}
						</p>
						<div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
							<BsClock className="w-3.5 h-3.5" />
							{comment.createdAt
								? getTimeAgo(new Date(comment.createdAt).getTime())
								: "Vừa xong"}
						</div>
					</div>

					<div className="mt-1 ml-2 flex items-center text-xs text-gray-500">
						<button
							className="flex items-center gap-1 hover:text-blue-500"
							onClick={() => onReply(comment.id)}
							disabled={isSubmitting}
						>
							<FaRegComment
								className={`${level > 0 ? "w-3 h-3" : "w-3.5 h-3.5"}`}
							/>
							<span>Trả lời</span>
						</button>
					</div>

					{replyingToId === comment.id && (
						<div className="mt-2 ml-2">
							<div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
								<p className="text-xs text-gray-600 mb-1">
									Trả lời bình luận của{" "}
									<span className="font-semibold">
										{comment.user || "User"}
									</span>
								</p>
								<textarea
									className={`w-full p-2 border rounded-lg ${
										level > 0 ? "text-xs" : "text-sm"
									}`}
									placeholder={`Viết câu trả lời của bạn...`}
									value={replyText[comment.id] || ""}
									onChange={(e) =>
										setReplyText({
											...replyText,
											[comment.id]: e.target.value,
										})
									}
									rows="2"
									disabled={isSubmitting}
								/>
								<div className="flex justify-end gap-2 mt-2">
									<button
										className={`${
											level > 0 ? "text-xs" : "text-sm"
										} text-gray-500 px-3 py-1 rounded hover:bg-gray-100`}
										onClick={() => onReply(null)}
										disabled={isSubmitting}
									>
										Hủy
									</button>
									<button
										className={`${
											level > 0 ? "text-xs" : "text-sm"
										} bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50`}
										onClick={() =>
											onPostReply(
												comment.id,
												level + 1,
												comment.user
											)
										}
										disabled={
											isSubmitting || !replyText[comment.id]?.trim()
										}
									>
										Gửi
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Hiển thị các trả lời */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="space-y-2">
					{/* Tiêu đề phần trả lời */}
					<div className="text-xs text-gray-500 ml-2 mt-1 flex items-center">
						<span className="mr-1">{comment.replies.length} trả lời</span>
						{level === 0 && (
							<div className="h-px flex-grow bg-gray-200 ml-2"></div>
						)}
					</div>

					{/* Danh sách trả lời */}
					<div className="space-y-1">
						{comment.replies.map((reply) => (
							<CommentItem
								key={reply.id}
								comment={reply}
								level={level + 1}
								userAvatar={userAvatar}
								onReply={onReply}
								replyingToId={replyingToId}
								replyText={replyText}
								setReplyText={setReplyText}
								onPostReply={onPostReply}
								isSubmitting={isSubmitting}
								onEditComment={onEditComment}
								onDeleteComment={onDeleteComment}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const PostCard = ({ post, onPostUpdate, onPostDelete, showStatus }) => {
	const { user } = useUser();
	const [likes, setLikes] = useState(post?.likes || 0);
	const [liked, setLiked] = useState(post?.isLiked || false);
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [comments, setComments] = useState([]);
	const [showSettings, setShowSettings] = useState(false);
	const [replyText, setReplyText] = useState({});
	const [replyingTo, setReplyingTo] = useState(null);
	const [expandedReplies, setExpandedReplies] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [userProfile, setUserProfile] = useState(null);
	const [editingComment, setEditingComment] = useState(null);
	const [editingContent, setEditingContent] = useState("");

	// Add state for editing post
	const [isEditingPost, setIsEditingPost] = useState(false);
	const [editedPostContent, setEditedPostContent] = useState(
		post?.content || ""
	);
	const [selectedEditImage, setSelectedEditImage] = useState(null);
	const [editImagePreview, setEditImagePreview] = useState(null);

	// Thêm states cho tooltip người like
	const [showLikeTooltip, setShowLikeTooltip] = useState(false);
	const [likersList, setLikersList] = useState([]);
	const [loadingLikers, setLoadingLikers] = useState(false);
	const likeTooltipRef = useRef(null);

	const userInfo = getUserInfo();
	const token = getToken();

	// Kiểm tra trạng thái like từ backend khi component mount hoặc khi post thay đổi
	useEffect(() => {
		if (post?.id) {
			loadPostLikeStatus();
		}
	}, [post?.id]);

	// Hàm kiểm tra xem người dùng hiện tại đã like bài viết chưa
	const loadPostLikeStatus = async () => {
		try {
			// Chắc chắn rằng có postId và user đã đăng nhập
			if (!post?.id || !token) return;

			// Gọi API để lấy trạng thái like
			const response = await postService.checkLikeStatus(post.id);

			// Cập nhật state liked và số lượng likes
			if (response !== undefined) {
				setLiked(response.isLiked || false);
				// Chỉ cập nhật số lượng likes nếu có trả về từ API
				if (response.likesCount !== undefined) {
					setLikes(response.likesCount);
				}
			}
		} catch (error) {
			console.error("Error loading like status:", error);
			// Giữ nguyên state hiện tại nếu có lỗi
		}
	};

	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!token) return;

			try {
				const decodedToken = JSON.parse(atob(token.split(".")[1]));
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

	useEffect(() => {
		const loadComments = async () => {
			if (showComments && post?.id) {
				try {
					setIsSubmitting(true);
					const response = await commentService.getCommentsByPostId(
						post.id
					);

					if (response) {
						// Dữ liệu từ commentService.getCommentsByPostId đã được sắp xếp phân cấp
						// với các replies trong thuộc tính replies của mỗi comment
						// Chỉ lọc comment active ở cấp cao nhất, giữ nguyên cấu trúc phân cấp
						const activeComments = Array.isArray(response)
							? response.filter(
									(comment) =>
										comment &&
										(comment.isActive === true ||
											comment.active === true)
							  )
							: [];

						setComments(activeComments);
					} else {
						setComments([]);
					}
				} catch (error) {
					console.error("Error loading comments:", error);
					setComments([]);
				} finally {
					setIsSubmitting(false);
				}
			}
		};

		loadComments();
	}, [showComments, post?.id]);

	const userAvatar =
		userProfile?.avatar ||
		user?.avatar ||
		userInfo?.avatar ||
		"https://i.pravatar.cc/100";
	const username =
		userProfile?.username || user?.sub || userInfo?.sub || "User 1";

	// Thêm hàm để lấy danh sách người đã like
	const fetchLikers = async () => {
		if (!post?.id || loadingLikers) return;

		try {
			setLoadingLikers(true);
			// Thử gọi API để lấy danh sách người đã like
			// Đây là giả định API endpoint, nếu backend không có sẵn, hãy cập nhật đúng endpoint
			const response = await postService.getPostLikers(post.id);

			if (response && Array.isArray(response)) {
				setLikersList(response);
			} else {
				// Nếu không có API hoặc API chưa triển khai, tạo danh sách giả để demo
				const demoLikers = [
					{
						id: 1,
						username: "User1",
						avatar: "https://i.pravatar.cc/100?img=1",
					},
					{
						id: 2,
						username: "User2",
						avatar: "https://i.pravatar.cc/100?img=2",
					},
					// Thêm thông tin người đang đăng nhập nếu đã like
					...(liked
						? [
								{
									id: user?.id || 99,
									username: username,
									avatar: userAvatar,
								},
						  ]
						: []),
				];
				setLikersList(demoLikers);
			}
		} catch (error) {
			console.error("Error fetching likers:", error);
			// Tạo danh sách giả nếu có lỗi
			setLikersList([
				...(liked
					? [
							{
								id: user?.id || 99,
								username: username,
								avatar: userAvatar,
							},
					  ]
					: []),
			]);
		} finally {
			setLoadingLikers(false);
		}
	};

	// Xử lý click outside để đóng tooltip
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				likeTooltipRef.current &&
				!likeTooltipRef.current.contains(event.target)
			) {
				setShowLikeTooltip(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Khi hiển thị tooltip, load danh sách likers
	useEffect(() => {
		if (showLikeTooltip) {
			fetchLikers();
		}
	}, [showLikeTooltip]);

	const toggleLike = async () => {
		try {
			setIsSubmitting(true);
			if (liked) {
				await postService.unlikePost(post.id);
				setLikes(likes - 1);
			} else {
				await postService.likePost(post.id);
				setLikes(likes + 1);
			}
			setLiked(!liked);

			// Sau khi like/unlike, cập nhật lại likersList nếu tooltip đang mở
			if (showLikeTooltip) {
				fetchLikers();
			}
		} catch (error) {
			console.error("Error toggling like:", error);
			toast.error("Có lỗi xảy ra khi thực hiện thao tác");
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleComments = () => setShowComments(!showComments);
	const toggleSettings = () => setShowSettings(!showSettings);

	const postComment = async () => {
		if (!commentText.trim() || !post?.id) return;

		try {
			setIsSubmitting(true);

			// Nếu đang chỉnh sửa một bình luận
			if (editingComment) {
				const commentData = {
					content: commentText,
					postId: post.id,
					isActive: true,
				};

				const response = await commentService.updateComment(
					editingComment.id,
					commentData
				);

				if (response) {
					// Cập nhật bình luận trong danh sách
					setComments((prevComments) =>
						prevComments.map((comment) =>
							comment.id === editingComment.id
								? { ...comment, content: commentText }
								: comment
						)
					);

					setCommentText("");
					setEditingComment(null);
					toast.success("Đã cập nhật bình luận");
				}
			} else {
				// Tạo bình luận mới
				const commentData = {
					content: commentText,
					postId: post.id,
					userId: user?.id || userInfo?.sub,
				};
				const response = await commentService.createComment(commentData);
				if (response) {
					// Fetch lại toàn bộ comments sau khi thêm mới
					const updatedComments = await commentService.getCommentsByPostId(
						post.id
					);
					if (Array.isArray(updatedComments)) {
						const activeComments = updatedComments.filter(
							(comment) =>
								comment &&
								(comment.isActive === true || comment.active === true)
						);
						setComments(activeComments);
					}
					setCommentText("");
					toast.success("Đã thêm bình luận thành công");
				}
			}
		} catch (error) {
			console.error("Error posting comment:", error);
			toast.error(
				"Không thể " +
					(editingComment ? "cập nhật" : "thêm") +
					" bình luận: " +
					error.message
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const postReply = async (commentId, level, replyingToUser) => {
		if (!replyText[commentId]?.trim() || !post?.id) return;

		try {
			setIsSubmitting(true);

			// Tạo nội dung reply bắt đầu bằng @username để dễ phân biệt
			const replyContent = `@${replyingToUser} ${replyText[
				commentId
			].trim()}`;

			const replyData = {
				content: replyContent,
				postId: post.id,
				parentId: commentId,
				parentCommentId: commentId,
				commentParentId: commentId,
				userId: user?.id || userInfo?.sub,
				replyingTo: replyingToUser,
				level: level,
				isReply: true,
			};

			toast.info("Đang gửi trả lời...");

			const response = await commentService.createComment(replyData);

			if (response) {
				// Trích xuất ID chính xác từ response
				const replyId = response.id || response.commentReplyId;

				if (!replyId) {
					toast.error("Không thể xác định ID của bình luận trả lời");
					return;
				}

				// Tạo đối tượng reply với đầy đủ thông tin
				const newReply = {
					...response,
					id: replyId,
					content: replyContent,
					parentId: commentId,
					replyingTo: replyingToUser,
					user: username,
					createdAt: new Date().toISOString(),
					level: level,
					replies: [],
					isReply: true,
				};

				// Hàm cập nhật comment trong cấu trúc phân cấp
				const updateCommentInHierarchy = (
					commentsArray,
					targetId,
					newReply
				) => {
					return commentsArray.map((comment) => {
						// Lấy id chính xác
						const commentId = comment.id || comment.commentReplyId;

						// Nếu đây là comment cần cập nhật
						if (commentId === targetId) {
							// Thêm reply vào replies của comment này
							return {
								...comment,
								replies: [...(comment.replies || []), newReply],
							};
						}

						// Nếu comment này có replies, tìm kiếm và cập nhật trong replies
						if (comment.replies && comment.replies.length > 0) {
							return {
								...comment,
								replies: updateCommentInHierarchy(
									comment.replies,
									targetId,
									newReply
								),
							};
						}

						// Không thay đổi comment này
						return comment;
					});
				};

				// Cập nhật state với cấu trúc phân cấp mới
				setComments((prevComments) => {
					const updated = updateCommentInHierarchy(
						prevComments,
						commentId,
						newReply
					);
					return updated;
				});

				// Xóa text trong ô input trả lời
				setReplyText({ ...replyText, [commentId]: "" });
				setReplyingTo(null);

				toast.success("Đã gửi trả lời thành công");

				// QUAN TRỌNG: Không tải lại từ server vì dữ liệu từ server là phẳng và không có cấu trúc phân cấp
				// Thay vào đó, chúng ta giữ nguyên cấu trúc phân cấp đã xây dựng trong frontend
			}
		} catch (error) {
			console.error("Error posting reply:", error);
			toast.error(
				"Không thể gửi trả lời: " +
					(error.response?.data?.message || error.message)
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderReplies = (
		replies,
		level = 1,
		parentId,
		expandedReplies,
		setExpandedReplies,
		replyingTo,
		setReplyingTo,
		replyText,
		setReplyText,
		postReply,
		userAvatar
	) => {
		if (!replies || !replies.length) return null;

		const isExpanded = expandedReplies[parentId];
		const visibleReplies = isExpanded
			? replies
			: replies.slice(0, MAX_VISIBLE_REPLIES);
		const hiddenCount = replies.length - visibleReplies.length;

		return (
			<div className="transition-all duration-500">
				{visibleReplies.map((reply) => (
					<div key={reply.id} className="mt-2">
						<CommentItem
							comment={reply}
							level={level}
							userAvatar={userAvatar}
							onReply={setReplyingTo}
							replyingToId={replyingTo}
							replyText={replyText}
							setReplyText={setReplyText}
							onPostReply={postReply}
							isSubmitting={isSubmitting}
							onEditComment={setEditingComment}
							onDeleteComment={handleDeleteComment}
						/>
						{renderReplies(
							reply.replies,
							level + 1,
							reply.id,
							expandedReplies,
							setExpandedReplies,
							replyingTo,
							setReplyingTo,
							replyText,
							setReplyText,
							postReply,
							userAvatar
						)}
					</div>
				))}

				{replies.length > MAX_VISIBLE_REPLIES && (
					<button
						className="ml-6 text-xs text-gray-700 font-semibold hover:underline mt-2 bg-transparent border-none outline-none cursor-pointer"
						onClick={() =>
							setExpandedReplies({
								...expandedReplies,
								[parentId]: !isExpanded,
							})
						}
					>
						{isExpanded ? (
							<>
								<BsChevronUp className="inline" /> Thu gọn phản hồi
							</>
						) : (
							<>
								<BsChevronDown className="inline" /> Xem {hiddenCount}{" "}
								phản hồi
							</>
						)}
					</button>
				)}
			</div>
		);
	};

	// Thêm hàm xử lý chỉnh sửa bình luận
	const handleEditComment = (comment) => {
		setEditingComment(comment);
		setCommentText(comment.content);
		setReplyingTo(null); // Tắt chế độ trả lời nếu đang mở
	};

	// Thêm hàm hủy chỉnh sửa
	const cancelEditing = () => {
		setEditingComment(null);
		setCommentText("");
	};

	// Thêm hàm xóa bình luận
	const handleDeleteComment = async (commentId) => {
		try {
			setIsSubmitting(true);
			const commentData = {
				postId: post.id,
				isActive: false,
			};

			await commentService.deleteComment(commentId, commentData);

			// Loại bỏ bình luận khỏi danh sách hiển thị
			setComments((prevComments) =>
				prevComments.filter((comment) => comment.id !== commentId)
			);

			toast.success("Đã xóa bình luận");
		} catch (error) {
			console.error("Error deleting comment:", error);
			toast.error("Không thể xóa bình luận: " + error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Hàm mở/đóng tooltip likes
	const toggleLikeTooltip = (e) => {
		e.stopPropagation(); // Ngăn không cho event lan đến toggleLike
		setShowLikeTooltip(!showLikeTooltip);
	};

	// Add handler for editing post
	const handleEditPost = () => {
		setIsEditingPost(true);
		setEditedPostContent(post?.content || "");
		setEditImagePreview(post?.imageUrl || null);
		setSelectedEditImage(null);
		setShowSettings(false);
	};

	// Add handler for canceling post edit
	const cancelEditPost = () => {
		setIsEditingPost(false);
		setEditedPostContent(post?.content || "");
		setSelectedEditImage(null);
		setEditImagePreview(null);
	};

	// Handler để chọn ảnh mới khi chỉnh sửa bài đăng
	const handleEditImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedEditImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Hàm xử lý xóa ảnh đang preview
	const handleRemoveEditImage = () => {
		setSelectedEditImage(null);
		setEditImagePreview(null);
	};

	// Add handler for saving post edit
	const saveEditPost = async () => {
		if (!editedPostContent.trim()) {
			toast.error("Nội dung bài viết không được để trống");
			return;
		}

		if (
			editedPostContent === post?.content &&
			!selectedEditImage &&
			post?.imageUrl === editImagePreview
		) {
			setIsEditingPost(false);
			return;
		}

		try {
			setIsSubmitting(true);

			// Gọi onPostUpdate với tham số imageFile
			// null khi muốn giữ nguyên ảnh cũ, undefined khi muốn xóa ảnh
			const imageFile =
				editImagePreview === null ? undefined : selectedEditImage;
			await onPostUpdate(post.id, editedPostContent, imageFile);

			setIsEditingPost(false);
			toast.success("Bài viết đã được cập nhật");
		} catch (error) {
			console.error("Error updating post:", error);
			toast.error(
				"Không thể cập nhật bài viết: " +
					(error.response?.data?.message || error.message)
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Add handler for deleting post
	const handleDeletePost = async () => {
		if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
			return;
		}

		try {
			setIsSubmitting(true);
			await onPostDelete(post.id);
			toast.success("Bài viết đã được xóa");
		} catch (error) {
			console.error("Error deleting post:", error);
			toast.error("Không thể xóa bài viết");
		} finally {
			setIsSubmitting(false);
			setShowSettings(false);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-4 hover:scale-105 transition-transform duration-300 ease-in-out relative">
			<button
				className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
				onClick={toggleSettings}
			>
				<CiSettings className="w-6 h-6" />
			</button>

			{showSettings && (
				<div className="absolute top-12 right-3 bg-white shadow-lg rounded-lg border p-3 w-40 z-50">
					<ul>
						<li
							className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer"
							onClick={handleEditPost}
						>
							Edit Post
						</li>
						<li
							className="text-red-500 hover:bg-gray-200 p-2 cursor-pointer"
							onClick={handleDeletePost}
						>
							Delete Post
						</li>
						<li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">
							Report
						</li>
					</ul>
				</div>
			)}

			<div className="flex items-center mb-4 relative">
				<div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
					<img
						src={user && user.avatar ? user.avatar : userAvatar}
						alt="User Avatar"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="ml-3 flex items-center">
					<h2 className="font-semibold text-xl text-gray-800">
						{username}
					</h2>
					<button className="ml-4 text-blue-500 text-sm font-medium hover:underline">
						Follow
					</button>
				</div>

				{/* Hiển thị trạng thái nếu showStatus = true và có thông tin isActive */}
				{showStatus && post?.isActive !== undefined && (
					<div
						className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
							post.isActive
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{post.isActive ? "Đang hiển thị" : "Đã xóa"}
					</div>
				)}
			</div>

			{isEditingPost ? (
				<div className="mb-4">
					<textarea
						className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={editedPostContent}
						onChange={(e) => setEditedPostContent(e.target.value)}
						rows="4"
						disabled={isSubmitting}
						placeholder="Nội dung bài viết..."
					/>

					{/* Phần upload và preview ảnh */}
					<div className="mt-3">
						{editImagePreview ? (
							<div className="relative">
								<img
									src={editImagePreview}
									alt="Preview"
									className="max-w-full h-auto rounded-lg"
								/>
								<button
									className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
									onClick={handleRemoveEditImage}
									disabled={isSubmitting}
								>
									<FaTrash className="w-3.5 h-3.5" />
								</button>
							</div>
						) : (
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
								<label className="cursor-pointer text-blue-500 hover:text-blue-700">
									<input
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleEditImageChange}
										disabled={isSubmitting}
									/>
									<FaImage className="mx-auto h-8 w-8 mb-2" />
									<span>Thêm hình ảnh</span>
								</label>
							</div>
						)}
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<button
							className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
							onClick={cancelEditPost}
							disabled={isSubmitting}
						>
							Hủy
						</button>
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
							onClick={saveEditPost}
							disabled={isSubmitting || !editedPostContent.trim()}
						>
							{isSubmitting ? "Đang lưu..." : "Lưu"}
						</button>
					</div>
				</div>
			) : (
				<div className="text-gray-800 mb-4">
					<p>{post?.content}</p>

					{/* Hiển thị hình ảnh nếu có */}
					{post?.imageUrl && (
						<div className="mt-3">
							<img
								src={post.imageUrl}
								alt="Post image"
								className="max-w-full h-auto rounded-lg object-cover"
								loading="lazy"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src =
										"https://via.placeholder.com/500x300?text=Ảnh+không+tồn+tại";
								}}
							/>
						</div>
					)}
				</div>
			)}

			<div className="flex justify-between items-center mt-4 space-x-6">
				<div className="relative">
					<button
						className={`flex items-center ${
							liked ? "text-red-500" : "text-gray-600"
						} hover:text-gray-900 transition-colors duration-200`}
						onClick={toggleLike}
					>
						{liked ? (
							<FaHeart className="w-6 h-6" />
						) : (
							<FaRegHeart className="w-6 h-6" />
						)}
						<span
							className="ml-2 text-sm cursor-pointer"
							onClick={toggleLikeTooltip}
						>
							{likes}
						</span>
					</button>

					{/* Tooltip hiển thị danh sách người đã like */}
					{showLikeTooltip && (
						<div
							ref={likeTooltipRef}
							className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg p-3 w-64 z-50 border border-gray-200"
						>
							<h4 className="font-semibold text-gray-700 mb-2 pb-1 border-b">
								Lượt thích ({likes})
							</h4>

							{loadingLikers ? (
								<div className="py-3 text-center text-gray-500">
									<span className="inline-block animate-spin mr-2">
										⟳
									</span>
									Đang tải...
								</div>
							) : likersList.length > 0 ? (
								<ul className="max-h-60 overflow-y-auto">
									{likersList.map((liker) => (
										<li
											key={liker.id}
											className="py-2 flex items-center gap-2"
										>
											<img
												src={
													liker.avatar ||
													"https://i.pravatar.cc/100"
												}
												alt={liker.username}
												className="w-8 h-8 rounded-full object-cover"
											/>
											<span className="text-sm font-medium">
												{liker.username}
											</span>
											{user?.id === liker.id && (
												<span className="ml-auto text-xs text-blue-500">
													Bạn
												</span>
											)}
										</li>
									))}
								</ul>
							) : (
								<p className="py-3 text-center text-gray-500">
									Chưa có lượt thích nào
								</p>
							)}
						</div>
					)}
				</div>

				<button
					className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
					onClick={toggleComments}
				>
					<FaRegComment className="w-6 h-6" />
				</button>
			</div>

			{showComments && (
				<div className="mt-4 border-t border-gray-200 pt-4">
					{/* Comment form */}
					<div className="flex gap-2 mb-4">
						<div className="w-9 h-9 rounded-full overflow-hidden">
							<img
								src={userAvatar}
								alt="User Avatar"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1 relative">
							<textarea
								className="w-full p-2 border rounded-lg text-sm"
								placeholder={
									editingComment
										? "Chỉnh sửa bình luận của bạn..."
										: "Viết bình luận của bạn..."
								}
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								rows="2"
								disabled={isSubmitting}
							/>
							<div className="absolute bottom-2 right-2 flex gap-2">
								{editingComment && (
									<button
										className="text-gray-500 disabled:text-gray-400 text-sm mr-2"
										onClick={cancelEditing}
										disabled={isSubmitting}
									>
										Hủy
									</button>
								)}
								<button
									className="text-blue-500 disabled:text-gray-400"
									onClick={postComment}
									disabled={isSubmitting || !commentText.trim()}
								>
									<FaPaperPlane />
								</button>
							</div>
						</div>
					</div>

					{/* Comments list */}
					<div className="mt-4 space-y-4">
						{isSubmitting && comments.length === 0 ? (
							<div className="text-center py-4 text-gray-500">
								Đang tải bình luận...
							</div>
						) : comments.length === 0 ? (
							<div className="text-center py-4 text-gray-500">
								Chưa có bình luận nào
							</div>
						) : (
							comments.map((comment) => (
								<CommentItem
									key={comment.id}
									comment={comment}
									userAvatar={userAvatar}
									onReply={setReplyingTo}
									replyingToId={replyingTo}
									replyText={replyText}
									setReplyText={setReplyText}
									onPostReply={postReply}
									isSubmitting={isSubmitting}
									onEditComment={handleEditComment}
									onDeleteComment={handleDeleteComment}
								/>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default PostCard;
