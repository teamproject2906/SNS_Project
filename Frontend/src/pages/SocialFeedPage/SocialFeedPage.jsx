import React, { useState, useEffect } from "react";
import PostCard from "./component/PostCard/PostCard";
import { FaCog, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import Header from "../../layouts/common/Header";
import CreatePostPopup from "../../components/Popup/CreatePostPopup";
import SearchPopup from "../../components/Popup/SearchPopup";
import { postService } from "../../services/postService";
import { toast } from "react-toastify";

const SocialFeedPage = () => {
	const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedPost, setSelectedPost] = useState(null);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			const data = await postService.getAllPosts();
			setPosts(data);
			setError(null);
		} catch (error) {
			console.error("Error fetching posts:", error);
			setError("Không thể tải bài viết");
			toast.error("Không thể tải bài viết");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const handlePostUpdate = async (postId, newContent, imageFile) => {
		try {
			let updatedPost;

			// Nếu có imageFile, sử dụng API updatePostWithImage
			if (imageFile !== undefined) {
				updatedPost = await postService.updatePostWithImage(
					postId,
					newContent,
					imageFile
				);
			} else {
				// Nếu chỉ cập nhật content, sử dụng API updatePost thông thường
				updatedPost = await postService.updatePost(postId, {
					content: newContent,
				});
			}

			// Fetch new data after successful update
			await fetchPosts();
			toast.success("Cập nhật bài viết thành công");
			return updatedPost;
		} catch (error) {
			console.error("Error updating post:", error);
			toast.error(
				"Cập nhật bài viết thất bại: " +
					(error.response?.data?.message || error.message)
			);
			throw error;
		}
	};

	const handlePostDelete = async (postId) => {
		try {
			const updatedPost = await postService.deactivatePost(postId, {
				active: false,
			});
			// Fetch new data after successful deactivation
			await fetchPosts();
			toast.success("Ẩn bài viết thành công");
		} catch (error) {
			console.error("Error hiding post:", error);
			toast.error("Ẩn bài viết thất bại");
		}
	};

	return (
		<>
			{/* Header */}
			<div>
				<Header />
			</div>
			<div className="flex min-h-screen bg-gray-50">
				{/* Sidebar */}
				<div className="w-16 flex flex-col items-start justify-start p-4 h-100">
					<div className="space-y-6">
						<button
							className="text-2xl"
							onClick={() => setIsSearchOpen(true)}
						>
							<FaSearch /> {/* Search */}
						</button>
						<button className="text-2xl">
							<FaUser /> {/* Profile */}
						</button>
						<button className="text-2xl">
							<FaCog /> {/* Settings */}
						</button>
						<button
							className="text-2xl"
							onClick={() => setIsCreatePostOpen(true)}
						>
							<FaPlus /> {/* Add Post Button */}
						</button>
					</div>
				</div>
				{/* Main Content */}
				<div className="flex-1 bg-gray-100 p-6">
					<div className="max-w-3xl mx-auto space-y-6">
						{/* <div className="bg-white rounded-xl shadow-lg p-6 flex items-center mb-4">
            <input
              type="text"
              placeholder="Type something"
              className="flex-1 bg-gray-100 p-3 rounded-lg text-gray-800 focus:outline-none"
            />
            <button className="ml-4 border px-6 py-2 rounded-lg">Post</button>
          </div> */}

						{/* PostCard */}
						{loading ? (
							<div className="text-center py-8">Đang tải...</div>
						) : error ? (
							<div className="text-center py-8 text-red-500">
								{error}
							</div>
						) : (
							<div className="space-y-4">
								{selectedPost ? (
									<PostCard
										key={selectedPost.id}
										post={selectedPost}
										onPostUpdate={handlePostUpdate}
										onPostDelete={handlePostDelete}
									/>
								) : (
									posts.map((post) => (
										<PostCard
											key={post.id}
											post={post}
											onPostUpdate={handlePostUpdate}
											onPostDelete={handlePostDelete}
										/>
									))
								)}
							</div>
						)}
					</div>
				</div>
				{/* Create Post Popup */}
				<CreatePostPopup
					isOpen={isCreatePostOpen}
					onClose={() => setIsCreatePostOpen(false)}
					onPostCreated={fetchPosts}
				/>
				{/* Search Popup */}
				<SearchPopup
					isOpen={isSearchOpen}
					onClose={() => setIsSearchOpen(false)}
					onPostSelect={(post) => {
						setSelectedPost(post);
						setIsSearchOpen(false);
					}}
				/>
			</div>
		</>
	);
};

export default SocialFeedPage;
