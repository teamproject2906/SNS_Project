import React, { useState, useEffect } from "react";
import { FaHeart, FaRegComment, FaRetweet, FaEllipsisV } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { useUser } from "../../context/UserContext"; // Import useUser hook
import { getUserInfo, getToken } from "../../pages/Login/app/static";
import axios from "axios";
import CommentsSection from "../CommentsSection/CommentsSection";

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
	const { user } = useUser();
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(post?.likes || 0);
	const [showComments, setShowComments] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(post?.content || "");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [userProfile, setUserProfile] = useState(null);

	const userInfo = getUserInfo();
	const token = getToken();

	// Debug log khi component mount và khi post thay đổi
	useEffect(() => {
		console.log("PostCard mounted/updated with post:", post);
		console.log("Post ID:", post?.id, "Type:", typeof post?.id);
	}, [post]);

	// Debug log khi showComments thay đổi
	useEffect(() => {
		console.log("Debug: showComments state changed to:", showComments);
		if (showComments) {
			console.log(
				"Debug: Comments should be visible now for post ID:",
				post?.id
			);
		}
	}, [showComments, post]);

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

	const userAvatar =
		userProfile?.avatar || user?.avatar || "https://i.pravatar.cc/100";
	const username = userProfile?.username || user?.sub || "User 1";

	const toggleLike = () => {
		setLiked(!liked);
		setLikes(liked ? likes - 1 : likes + 1);
	};

	const handleCommentClick = (e) => {
		e.preventDefault(); // Prevent any default behavior
		console.log("Comment button clicked");
		console.log("Current showComments state:", showComments);
		console.log("Post ID at click time:", post?.id);

		setShowComments((prevState) => {
			const newState = !prevState;
			console.log("Setting showComments to:", newState);
			return newState;
		});
	};

	const toggleSettings = () => {
		setShowSettings(!showSettings);
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
			</div>

			<div className="text-gray-800 mb-4">
				<p>{isEditing ? editText : post?.content}</p>
			</div>

			<div className="flex justify-between items-center mt-4 space-x-6">
				<button
					className={`flex items-center ${
						liked ? "text-red-500" : "text-gray-600"
					} hover:text-gray-900 transition-colors duration-200`}
					onClick={toggleLike}
				>
					<FaHeart className="w-6 h-6" />
					<span className="ml-2 text-sm">{likes}K</span>
				</button>

				<button
					className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
					onClick={handleCommentClick}
					type="button"
				>
					<FaRegComment className="w-6 h-6" />
					<span className="ml-2 text-xs">
						{showComments ? "Ẩn bình luận" : "Hiện bình luận"}
					</span>
				</button>

				<button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
					<FaRetweet className="w-6 h-6" />
				</button>
			</div>

			{showComments && (
				<div className="mt-4 border-t pt-4">
					{!post?.id ? (
						<div className="text-center py-4 text-red-500">
							Không thể tải bình luận: ID bài viết không hợp lệ
						</div>
					) : (
						<>
							<div className="bg-gray-100 p-2 mb-2 rounded text-xs">
								<p>
									Debug: Post ID = {post.id}, Type: {typeof post.id}
								</p>
							</div>
							<CommentsSection
								key={`comments-${post.id}`}
								postId={post.id.toString()}
							/>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default PostCard;
