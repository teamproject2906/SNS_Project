import React, { useState } from "react";
import { FaHeart, FaRegComment, FaRetweet, FaPaperPlane, FaEllipsisV, FaUserPlus } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

const PostCard = () => {
  // State cho số lượt thích và trạng thái của biểu tượng like (để đổi màu)
  const [likes, setLikes] = useState(40.9); // Số lượt likes
  const [liked, setLiked] = useState(false); // Trạng thái like

  // State cho phần bình luận
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState(""); // Text bình luận
  const [comments, setComments] = useState([]); // Mảng bình luận

  // State cho phần dropdown menu của settings
  const [showSettings, setShowSettings] = useState(false); // Hiển thị menu settings

  // Hàm xử lý khi nhấn vào biểu tượng like
  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 0.1 : likes + 0.1); // Cập nhật số lượt thích
  };

  // Hàm xử lý khi nhấn vào biểu tượng comment (hiển thị/ẩn phần bình luận)
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Hàm xử lý khi nhấn "Post Comment"
  const postComment = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]); // Thêm bình luận mới vào mảng
      setCommentText(""); // Reset input text sau khi post
    }
  };

  // Hàm xử lý khi nhấn vào biểu tượng settings (hiển thị/ẩn menu)
  const toggleSettings = () => {
    setShowSettings(!showSettings);
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
            <li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">Edit Post</li>
            <li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">Delete Post</li>
            <li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">Report</li>
          </ul>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center mb-4 relative">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbiigxlSItMGEINLKB2wgjZ9b21BxWYei0mg&s" alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="ml-3 flex items-center">
          <h2 className="font-semibold text-xl text-gray-800">User 1</h2>
          <button className="ml-4 text-blue-500 text-sm font-medium hover:underline">
            Follow
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="text-gray-800 mb-4">
        <p>
          This is a cool post with modern, minimalist design. The icons include Like, Comment, Share, Repost, Follow, and Settings. Clean and functional.
        </p>
      </div>

      {/* Footer Section (Likes, Comments, Share, Repost, Send) */}
      <div className="flex justify-between items-center mt-4 space-x-6">
        {/* Like Button */}
        <button
          className={`flex items-center ${liked ? "text-red-500" : "text-gray-600"} hover:text-gray-900 transition-colors duration-200`}
          onClick={toggleLike}
        >
          <FaHeart className="w-6 h-6" />
          <span className="ml-2 text-sm">{likes.toFixed(1)}K</span>
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

        {/* Send Button */}
        <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
          <FaPaperPlane className="w-6 h-6" />
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 border-t pt-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)} // Cập nhật nội dung bình luận
            rows="3"
          ></textarea>
          <button
            className="mt-2 border bg-slate-50 w-[100%] px-6 py-2 rounded-lg"
            onClick={postComment} // Gửi bình luận
          >
            Post
          </button>

          {/* Display Comments */}
          <div className="mt-4">
            {comments.length > 0 && (
              <div>
                {comments.map((comment, index) => (
                  <div key={index} className="p-2 mt-2 border-b">
                    <p className="text-gray-700">{comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
