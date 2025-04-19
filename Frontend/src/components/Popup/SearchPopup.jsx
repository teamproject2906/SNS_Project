import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { postService } from "../../services/postService";
import { toast } from "react-toastify";
import PostCard from "../PostCard";
import { useNavigate } from "react-router-dom";

const SearchPopup = ({ isOpen, onClose, onPostSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch posts based on search query
  useEffect(() => {
    const fetchPosts = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        let data = [];

        if (debouncedQuery.trim() === "") {
          // Nếu không có query, hiển thị các bài viết ngẫu nhiên
          data = await postService.getRandomPosts();
        } else {
          // Nếu có query, tìm kiếm bài viết
          data = await postService.searchPosts(debouncedQuery);
        }

        // Đảm bảo data luôn là một mảng
        if (!Array.isArray(data)) {
          data = [];
        }

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Không thể tải bài viết");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [debouncedQuery, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[80%] h-[90vh] max-w-[900px] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2">
              <FaSearch className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(90vh-80px)]">
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {debouncedQuery.trim() === ""
                ? "Không có bài viết nào"
                : "Không tìm thấy bài viết phù hợp"}
            </div>
          ) : (
            <>
              <div className="text-xs text-gray-500 mb-4 bg-gray-100 p-2 rounded-lg">
                <p>
                  Lưu ý: Admin có thể xem cả bài viết đã xóa (dấu đỏ) và chưa
                  xóa (dấu xanh). Người dùng thường chỉ xem được bài viết chưa
                  xóa.
                </p>
              </div>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="cursor-pointer transition-all hover:scale-[1.01]"
                    onClick={() => {
                      onClose();
                      onPostSelect(post);
                    }}
                  >
                    <PostCard
                      post={post}
                      onPostUpdate={() => {}}
                      onPostDelete={() => {}}
                      showStatus={true}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
