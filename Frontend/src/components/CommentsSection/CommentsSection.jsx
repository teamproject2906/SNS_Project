import { useState, useEffect, useRef } from "react";
import {
	FaThumbsUp,
	FaEllipsisV,
	FaReply,
	FaEdit,
	FaTrash,
} from "react-icons/fa";
import { commentService } from "../../services/commentService";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

// Helper function to determine active status from response
const getActiveStatus = (response) => {
	// Backend uses isActive field, check both possible field names
	if (response?.isActive !== undefined) return response.isActive;
	if (response?.active !== undefined) return response.active;
	return true; // Default to true if no field found
};

// Helper function to parse API responses
const parseApiResponse = (response) => {
	// Handle direct data or response.data
	const data = response.data || response;

	if (!data) {
		console.error("No data in response");
		return null;
	}

	return data;
};

const CommentsSection = ({ postId }) => {
	const { user } = useUser();
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(false);
	const [editingComment, setEditingComment] = useState(null);
	const [editContent, setEditContent] = useState("");
	const [menuOpen, setMenuOpen] = useState(null);
	const [expandedComments, setExpandedComments] = useState({});
	const menuRef = useRef(null);

	// Validate postId
	useEffect(() => {
		if (!postId) {
			toast.warning("Không thể tải bình luận: Thiếu ID bài viết");
		}
	}, [postId]);

	// Load comments when component mounts or postId changes
	useEffect(() => {
		if (postId) {
			fetchComments();
		}
	}, [postId]);

	// Handle click outside dropdown menu
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setMenuOpen(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Fetch comments from API
	const fetchComments = async () => {
		try {
			setLoading(true);

			// Validate postId
			if (!postId) {
				toast.error("Không thể tải bình luận: Thiếu ID bài viết");
				setComments([]);
				return;
			}

			// Try getting all comments first
			const allCommentsResponse =
				await commentService.getAllCommentsByPostId(postId);

			if (
				Array.isArray(allCommentsResponse) &&
				allCommentsResponse.length > 0
			) {
				// Filter for active comments only
				const activeComments = allCommentsResponse.filter((comment) => {
					const isActiveField = comment.isActive === true;
					const activeField = comment.active === true;
					return isActiveField || activeField;
				});

				setComments(activeComments);
				return;
			}

			// If first attempt fails, try the regular endpoint
			const response = await commentService.getCommentsByPostId(postId);

			if (Array.isArray(response) && response.length > 0) {
				const activeComments = response.filter((comment) => {
					const isActiveField = comment.isActive === true;
					const activeField = comment.active === true;
					return isActiveField || activeField;
				});

				setComments(activeComments);
			} else {
				setComments([]);
				toast.info("Chưa có bình luận nào cho bài viết này");
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
			toast.error(
				"Không thể tải bình luận: " +
					(error.response?.data?.message || error.message)
			);
			setComments([]);
		} finally {
			setLoading(false);
		}
	};

	// Submit new comment
	const handleSubmitComment = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		try {
			setLoading(true);

			// Validate postId
			if (!postId) {
				toast.error("Không thể thêm bình luận: Thiếu ID bài viết");
				return;
			}

			// Create commentData with the correct structure
			const commentData = {
				content: newComment,
				postId: postId,
				isActive: true, // Backend model expects isActive
			};

			// Get user ID from context
			const userId = user?.sub || user?.username;

			const apiResponse = await commentService.createComment(commentData);

			// Parse and process response
			const parsedResponse = parseApiResponse(apiResponse);
			if (parsedResponse) {
				// Add new comment directly to state
				const newCommentObj = {
					id:
						parsedResponse.id ||
						parsedResponse.commentReplyId ||
						Date.now(),
					content: parsedResponse.content || newComment,
					user: parsedResponse.user || userId || "Người dùng",
					postId: parsedResponse.postId || postId,
					createdAt: new Date().toISOString(),
					isActive: true, // Explicitly set to true for new comments
				};

				// Add to state
				setComments((prevComments) => [...prevComments, newCommentObj]);

				// Show toast notification
				toast.success("Đã thêm bình luận");

				// Refresh from server to synchronize
				setTimeout(async () => {
					await fetchComments();
				}, 500);

				setNewComment("");
			} else {
				// If parsing fails, simply refresh comments from server
				await fetchComments();
				setNewComment("");
				toast.success("Đã thêm bình luận và làm mới dữ liệu");
			}
		} catch (error) {
			console.error("Error adding comment:", error);
			if (error.response) {
				toast.error(
					`Không thể thêm bình luận: ${
						error.response.data.message || error.message
					}`
				);
			} else {
				toast.error("Không thể thêm bình luận: Lỗi kết nối");
			}
		} finally {
			setLoading(false);
		}
	};

	// Update comment
	const handleUpdateComment = async (e) => {
		e.preventDefault();
		if (!editContent.trim()) return;

		try {
			setLoading(true);

			// Check if this is a temporary comment
			const isTemporaryComment =
				editingComment.id.toString().startsWith("temp-") ||
				editingComment._tempId !== undefined;

			if (isTemporaryComment) {
				// Update temporary comment in state only
				setComments((prevComments) =>
					prevComments.map((comment) => {
						if (comment.id === editingComment.id) {
							return {
								...comment,
								content: editContent,
								updatedAt: new Date().toISOString(),
							};
						}
						return comment;
					})
				);

				setEditingComment(null);
				toast.success("Đã cập nhật bình luận");
				return;
			}

			// Create commentData with the correct structure
			const commentData = {
				content: editContent,
				postId: postId,
				isActive: true,
			};

			await commentService.updateComment(editingComment.id, commentData);

			// Refresh comments from server
			await fetchComments();

			setEditingComment(null);
			toast.success("Đã cập nhật bình luận");
		} catch (error) {
			console.error("Error updating comment:", error);
			if (error.response) {
				toast.error(
					`Không thể cập nhật bình luận: ${
						error.response.data.message || error.message
					}`
				);
			} else {
				toast.error("Không thể cập nhật bình luận: Lỗi kết nối");
			}
		} finally {
			setLoading(false);
		}
	};

	// Delete comment
	const handleDeleteComment = async (commentId) => {
		try {
			setLoading(true);

			// Check if this is a temporary comment
			const isTemporaryComment = commentId.toString().startsWith("temp-");
			const commentToDelete = comments.find((c) => c.id === commentId);
			const hasTemporaryFlag =
				commentToDelete && commentToDelete._tempId !== undefined;

			if (isTemporaryComment || hasTemporaryFlag) {
				// Remove temporary comment from state only
				setComments((prevComments) =>
					prevComments.filter((comment) => comment.id !== commentId)
				);
				toast.success("Đã xóa bình luận");
				setMenuOpen(null);
				return;
			}

			// Create commentData with the correct structure
			const commentData = {
				postId: postId,
				isActive: false, // Set isActive to false to mark as deleted
			};

			await commentService.deleteComment(commentId, commentData);

			// Refresh comments from server
			await fetchComments();

			setMenuOpen(null);
			toast.success("Đã xóa bình luận");
		} catch (error) {
			console.error("Error deleting comment:", error);
			if (error.response) {
				toast.error(
					`Không thể xóa bình luận: ${
						error.response.data.message || error.message
					}`
				);
			} else {
				toast.error("Không thể xóa bình luận: Lỗi kết nối");
			}
		} finally {
			setLoading(false);
		}
	};

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
	};

	// Toggle menu display
	const toggleMenu = (commentId) => {
		setMenuOpen(menuOpen === commentId ? null : commentId);
	};

	// Handle edit button click
	const handleEditClick = (comment) => {
		setEditingComment(comment);
		setEditContent(comment.content);
		setMenuOpen(null);
	};

	// Toggle full text display
	const toggleFullText = (commentId) => {
		setComments(
			comments.map((comment) => {
				if (comment.id === commentId) {
					return { ...comment, expanded: !comment.expanded };
				}
				return comment;
			})
		);
	};

	return (
		<div className="commentsSection mt-5 bg-white shadow-md rounded-lg p-4">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold">
					Bình luận ({comments.length})
				</h3>
				<div className="flex gap-2">
					<button
						onClick={async () => {
							setLoading(true);
							await fetchComments();
							setLoading(false);
						}}
						className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
						disabled={loading}
					>
						Force Refresh
					</button>
					<button
						onClick={() => fetchComments()}
						className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
						disabled={loading}
					>
						{loading ? "Đang tải..." : "Làm mới"}
					</button>
				</div>
			</div>

			{/* Loading state */}
			{loading && (
				<div className="text-center p-4 bg-blue-50 rounded mb-4">
					<p className="text-blue-600">Đang tải dữ liệu bình luận...</p>
				</div>
			)}

			{/* Error state - when postId is not provided */}
			{!postId && (
				<div className="text-center p-4 bg-red-50 rounded mb-4">
					<p className="text-red-600">
						Không thể tải bình luận: Thiếu ID bài viết
					</p>
				</div>
			)}

			{/* Form to add new comment */}
			{postId && (
				<div className="addComment mt-4">
					<form
						onSubmit={handleSubmitComment}
						className="flex items-start gap-2"
					>
						<img
							src={user?.avatar || "https://i.pravatar.cc/100"}
							alt="User"
							className="w-10 h-10 rounded-full object-cover"
						/>
						<div className="flex-1">
							<textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Viết bình luận của bạn..."
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="2"
							></textarea>
							<div className="flex justify-between items-center mt-2">
								<div className="text-xs text-gray-500">
									{loading && (
										<span className="text-blue-500">
											Đang xử lý...
										</span>
									)}
								</div>
								<button
									type="submit"
									disabled={!newComment.trim() || loading}
									className={`px-4 py-2 rounded-md text-white font-medium ${
										!newComment.trim() || loading
											? "bg-gray-400"
											: "bg-blue-500 hover:bg-blue-600"
									}`}
								>
									{loading ? "Đang gửi..." : "Bình luận"}
								</button>
							</div>
						</div>
					</form>
				</div>
			)}

			{/* Comments list */}
			<div className="commentsList mt-6 border border-gray-200 rounded">
				{loading && comments.length === 0 ? (
					<p className="text-center py-4 text-gray-500">
						Đang tải bình luận...
					</p>
				) : comments.length === 0 ? (
					<p className="text-center py-4 text-gray-500">
						Chưa có bình luận nào
					</p>
				) : !Array.isArray(comments) ? (
					<div className="bg-red-100 p-4 rounded">
						<p className="text-red-600">
							Lỗi: Dữ liệu comments không đúng dạng mảng
						</p>
						<button
							onClick={fetchComments}
							className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
						>
							Thử lại
						</button>
					</div>
				) : (
					comments.map((comment) => {
						// Ensure content is a string
						const contentValue = comment.content || "";

						return (
							<div
								key={
									comment.id || `temp-${Date.now()}-${Math.random()}`
								}
								className={`commentItem border-t pt-3 pb-3 px-4 ${
									comment.id?.toString().startsWith("temp-")
										? "relative border-dashed border-yellow-300 bg-yellow-50"
										: "hover:bg-gray-50"
								}`}
							>
								{comment.id?.toString().startsWith("temp-") && (
									<span className="absolute -top-2 right-0 text-xs text-yellow-600 bg-yellow-50 px-1 rounded">
										Đang xử lý
									</span>
								)}
								{editingComment?.id === comment.id ? (
									// Edit comment form
									<form
										onSubmit={handleUpdateComment}
										className="mt-2"
									>
										<textarea
											value={editContent}
											onChange={(e) =>
												setEditContent(e.target.value)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											rows="2"
										></textarea>
										<div className="flex justify-end gap-2 mt-2">
											<button
												type="button"
												onClick={() => setEditingComment(null)}
												className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
											>
												Hủy
											</button>
											<button
												type="submit"
												disabled={!editContent.trim() || loading}
												className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
											>
												Lưu
											</button>
										</div>
									</form>
								) : (
									<>
										<div className="flex items-center gap-3">
											<img
												src={
													comment.userAvatar ||
													"https://i.pravatar.cc/100"
												}
												alt="User avatar"
												className="w-10 h-10 rounded-full"
											/>
											<div className="flex-grow">
												<p className="font-semibold">
													{comment.user || "Người dùng"}
												</p>
												<p className="text-sm text-gray-500">
													{comment.id
														?.toString()
														.startsWith("temp-")
														? "Vừa xong"
														: comment.createdAt
														? formatDate(comment.createdAt)
														: ""}
												</p>
											</div>
											<div className="relative" ref={menuRef}>
												<button
													onClick={() => toggleMenu(comment.id)}
													className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
												>
													<FaEllipsisV />
												</button>
												{menuOpen === comment.id && (
													<div className="absolute right-0 w-36 bg-white shadow-lg rounded-md overflow-hidden z-10">
														<ul className="py-1">
															<li>
																<button
																	onClick={() =>
																		handleEditClick(comment)
																	}
																	className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
																>
																	<FaEdit size={14} /> Chỉnh
																	sửa
																</button>
															</li>
															<li>
																<button
																	onClick={() =>
																		handleDeleteComment(
																			comment.id
																		)
																	}
																	className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
																>
																	<FaTrash size={14} /> Xóa
																</button>
															</li>
														</ul>
													</div>
												)}
											</div>
										</div>
										<div className="commentContent mt-2 bg-gray-50 p-2 rounded">
											{contentValue.trim() === "" ? (
												<p className="text-gray-400 italic">
													Nội dung trống
												</p>
											) : (
												<p className="whitespace-pre-wrap break-words">
													{comment.expanded ||
													contentValue.length <= 150
														? contentValue
														: `${contentValue.substring(
																0,
																150
														  )}...`}
													{contentValue.length > 150 && (
														<button
															onClick={() =>
																toggleFullText(comment.id)
															}
															className="text-blue-500 ml-2 text-sm"
														>
															{comment.expanded
																? "Thu gọn"
																: "Xem thêm"}
														</button>
													)}
												</p>
											)}
										</div>
									</>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default CommentsSection;