import React, { useState, useEffect } from "react";
import {
	FaHeart,
	FaRegComment,
	FaRetweet,
	FaPaperPlane,
	FaEllipsisV,
	FaUserPlus,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { BsClock, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useUser } from "../../context/UserContext"; // Import useUser hook
import { commentService } from "../../services/commentService";
import { getUserInfo, getToken } from "../../../../pages/Login/app/static";
import axios from "axios";

const MAX_VISIBLE_REPLIES = 2;

const getTimeAgo = (timestamp) => {
	const seconds = Math.floor((Date.now() - timestamp) / 1000);
	const minutes = Math.floor(seconds / 60);
	return `${minutes === 0 ? 1 : minutes} phút trước`;
};

const ReplyItem = ({
	reply,
	level,
	onReply,
	replyingToId,
	replyText,
	setReplyText,
	postReply,
	userAvatar,
}) => {
	const isReplying = replyingToId === reply.id;

	return (
		<div
			className="flex items-start gap-2 relative transition-all duration-300"
			style={{ paddingLeft: `${level * 20}px` }}
		>
			{level > 0 && (
				<div
					className="absolute top-2 bottom-0 w-px bg-gray-300"
					style={{ left: `${(level - 1) * 20 + 8}px` }}
				></div>
			)}
			<div className="w-6 h-6 rounded-full overflow-hidden">
				<img
					src={
						reply.user?.avatar ||
						userAvatar ||
						`https://i.pravatar.cc/30?img=${(reply.id % 10) + 1}`
					}
					alt="Reply Avatar"
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="flex-1">
				<div className="bg-gray-100 p-2 rounded-xl">
					<p className="text-sm">
						<span className="font-semibold">
							{reply.user?.name || "User"}:{" "}
						</span>
						{reply.replyingTo && (
							<span className="text-gray-800 font-semibold mr-1">
								@{reply.replyingTo}
							</span>
						)}
						{reply.content}
					</p>
					<div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
						<BsClock className="w-3.5 h-3.5" />
						{getTimeAgo(reply.createdAt)}
					</div>
				</div>
				<div className="text-xs text-gray-500 mt-1 flex gap-4 items-center pl-2">
					<button
						className="flex items-center gap-1 hover:text-blue-500"
						onClick={() => onReply(reply.id)}
					>
						<FaRegComment className="w-3.5 h-3.5" />
					</button>
				</div>

				{isReplying && (
					<div className="mt-2">
						<textarea
							className="w-full p-2 border rounded-lg text-sm"
							placeholder={`Trả lời ${reply.user?.name || "User"}...`}
							value={replyText[reply.id] || ""}
							onChange={(e) =>
								setReplyText({
									...replyText,
									[reply.id]: e.target.value,
								})
							}
							rows="2"
						/>
						<button
							className="mt-1 text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
							onClick={() =>
								postReply(reply.id, level + 1, reply.user?.name)
							}
						>
							Reply
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
	// Use the useUser hook to get the current logged-in user's data
	const { user } = useUser();

	// State cho số lượt thích và trạng thái của biểu tượng like (để đổi màu)
	const [likes, setLikes] = useState(0); // Số lượt likes
	const [liked, setLiked] = useState(false); // Trạng thái like

	// State cho phần bình luận
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState(""); // Text bình luận
	const [comments, setComments] = useState([]); // Mảng bình luận

	// State cho phần dropdown menu của settings
	const [showSettings, setShowSettings] = useState(false); // Hiển thị menu settings

	// State for loading comments
	const [isLoading, setIsLoading] = useState(false);

	// State for replying to a comment
	const [replyText, setReplyText] = useState({});
	const [replyingTo, setReplyingTo] = useState(null);
	const [expandedReplies, setExpandedReplies] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(post?.content || "");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [userProfile, setUserProfile] = useState(null);

	const userInfo = getUserInfo();
	const token = getToken();

	const parseJwt = (token) => {
		if (!token) return null;
		try {
			return JSON.parse(atob(token.split(".")[1]));
		} catch (e) {
			return null;
		}
	};

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

	// Load comments when showComments is true
	useEffect(() => {
		const loadComments = async () => {
			if (showComments && post?.id) {
				try {
					setIsSubmitting(true);
					const response = await commentService.getCommentsByPostId(
						post.id
					);
					setComments(response.data || []);
				} catch (error) {
					console.error("Error loading comments:", error);
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

	// Hàm xử lý khi nhấn vào biểu tượng like
	const toggleLike = () => {
		setLiked(!liked);
		setLikes(liked ? likes - 1 : likes + 1); // Cập nhật số lượt thích
	};

	// Hàm xử lý khi nhấn vào biểu tượng comment (hiển thị/ẩn phần bình luận)
	const toggleComments = () => {
		setShowComments(!showComments);
	};

	// Hàm xử lý khi nhấn "Post Comment"
	const postComment = async () => {
		if (!commentText.trim() || !post?.id) return;

		try {
			setIsSubmitting(true);
			const commentData = {
				content: commentText,
				postId: post.id,
			};
			const response = await commentService.createComment(commentData);
			if (response.success) {
				setComments([...comments, response.data]);
				setCommentText("");
			}
		} catch (error) {
			console.error("Error posting comment:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Hàm xử lý khi nhấn vào biểu tượng settings (hiển thị/ẩn menu)
	const toggleSettings = () => {
		setShowSettings(!showSettings);
	};

	const postReply = async (commentId, level, replyingToUser) => {
		if (!replyText[commentId]?.trim() || !post?.id) return;

		try {
			setIsSubmitting(true);
			const replyData = {
				content: replyText[commentId],
				postId: post.id,
				parentCommentId: commentId,
			};
			const response = await commentService.createComment(replyData);
			if (response.success) {
				const updatedComments = comments.map((comment) => {
					if (comment.id === commentId) {
						return {
							...comment,
							replies: [...(comment.replies || []), response.data],
						};
					}
					return comment;
				});
				setComments(updatedComments);
				setReplyText({ ...replyText, [commentId]: "" });
				setReplyingTo(null);
			}
		} catch (error) {
			console.error("Error posting reply:", error);
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
						<ReplyItem
							reply={reply}
							level={level}
							onReply={setReplyingTo}
							replyingToId={replyingTo}
							replyText={replyText}
							setReplyText={setReplyText}
							postReply={postReply}
							userAvatar={userAvatar}
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

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-4 hover:scale-105 transition-transform duration-300 ease-in-out relative">
			{/* Setting Icon */}
			<button
				className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
				onClick={toggleSettings}
			>
				<CiSettings className="w-6 h-6" />
			</button>

			{/* Dropdown Menu for Settings */}
			{showSettings && (
				<div className="absolute top-12 right-3 bg-white shadow-lg rounded-lg border p-3 w-40">
					<ul>
						<li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">
							Edit Post
						</li>
						<li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">
							Delete Post
						</li>
						<li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">
							Report
						</li>
					</ul>
				</div>
			)}

			{/* Header Section */}
			<div className="flex items-center mb-4 relative">
				{/* Avatar */}
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
			</div>

			{/* Content Section */}
			<div className="text-gray-800 mb-4">
				<p>{isEditing ? editText : post?.content}</p>
			</div>

			{/* Footer Section (Likes, Comments, Share, Repost, Send) */}
			<div className="flex justify-between items-center mt-4 space-x-6">
				{/* Like Button */}
				<button
					className={`flex items-center ${
						liked ? "text-red-500" : "text-gray-600"
					} hover:text-gray-900 transition-colors duration-200`}
					onClick={toggleLike}
				>
					<FaHeart className="w-6 h-6" />
					<span className="ml-2 text-sm">{likes}K</span>
				</button>

				{/* Comment Button */}
				<button
					className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
					onClick={toggleComments}
				>
					<FaRegComment className="w-6 h-6" />
				</button>

				{/* Repost Button */}
				<button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
					<FaRetweet className="w-6 h-6" />
				</button>
			</div>

			{/* Comment Section */}
			{showComments && (
				<div className="mt-4 border-t pt-4">
					<textarea
						className="w-full p-2 border rounded-lg"
						placeholder="Write a comment..."
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						rows="3"
						disabled={isSubmitting}
					></textarea>
					<button
						className="mt-2 w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
						onClick={postComment}
						disabled={isSubmitting || !commentText.trim()}
					>
						{isSubmitting ? "Đang đăng..." : "Post"}
					</button>

					<div className="mt-4 space-y-4">
						{isSubmitting ? (
							<div className="text-center">Đang tải bình luận...</div>
						) : comments.length > 0 ? (
							comments.map((comment) => (
								<div
									key={comment.id}
									className="flex items-start gap-3"
								>
									<div className="w-8 h-8 rounded-full overflow-hidden">
										<img
											src={
												comment.user?.avatar ||
												userAvatar ||
												"https://i.pravatar.cc/40?img=1"
											}
											alt="Avatar"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1">
										<div className="bg-gray-100 p-3 rounded-xl">
											<h4 className="font-semibold text-sm">
												{comment.user?.name || "User"}
											</h4>
											<p className="text-sm mt-1">
												{comment.content}
											</p>
											<div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
												<BsClock className="w-3.5 h-3.5" />
												{getTimeAgo(comment.createdAt)}
											</div>
										</div>

										<div className="text-xs text-gray-500 mt-1 flex space-x-4 pl-2 items-center">
											<button className="flex items-center gap-1 hover:text-red-500">
												<FaHeart className="w-3.5 h-3.5" />
												{comment.likes || 0}
											</button>
											<button
												className="flex items-center gap-1 hover:text-blue-500"
												onClick={() => setReplyingTo(comment.id)}
											>
												<FaRegComment className="w-3.5 h-3.5" />
											</button>
										</div>

										{replyingTo === comment.id && (
											<div className="mt-2">
												<textarea
													className="w-full p-2 border rounded-lg text-sm"
													placeholder="Write a reply..."
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
												<button
													className="mt-1 text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
													onClick={() =>
														postReply(
															comment.id,
															1,
															comment.user?.name
														)
													}
													disabled={
														isSubmitting ||
														!replyText[comment.id]?.trim()
													}
												>
													{isSubmitting ? "Đang đăng..." : "Reply"}
												</button>
											</div>
										)}

										<div className="ml-6 mt-2 space-y-2">
											{renderReplies(
												comment.replies,
												1,
												comment.id,
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
									</div>
								</div>
							))
						) : (
							<div className="text-center text-gray-500">
								Chưa có bình luận nào
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default PostCard;
