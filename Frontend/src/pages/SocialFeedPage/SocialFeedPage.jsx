import { useState, useEffect } from "react";
import Header from "../../layouts/common/Header";
import { postService } from "../../services/postService";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Social/Sidebar";
import { useUser } from "../../context/UserContext";

const SocialFeedPage = () => {
  const { id: postId } = useParams(); // Lấy ID bài đăng từ URL nếu có
  const { user } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Hàm để tải tất cả bài post
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Unable to load the post");
      toast.error("Unable to load the post");
    } finally {
      setLoading(false);
    }
  };

  // Hàm để tải một bài post cụ thể theo ID
  const fetchPostById = async (id) => {
    try {
      setLoading(true);
      const post = await postService.getPostById(id);

      // Kiểm tra kỹ hơn về dữ liệu trả về
      if (post && (post.id || post.post_id)) {
        setSelectedPost(post);
        setError(null);
      } else {
        console.error("Post data invalid:", post);
        setError(
          "Post not found. The post may have been deleted or the ID is invalid."
        );
        toast.error(
          "Post not found. The post may have been deleted or the ID is invalid.",
          {
            autoClose: 5000,
          }
        );
        // Không chuyển hướng ngay lập tức, để hiển thị thông báo lỗi
        setTimeout(() => {
          navigate("/social");
        }, 3000);
      }
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      const errorMessage =
        error.response?.status === 404
          ? "Post not found. The post may have been deleted."
          : "Unable to load the post. Please try again later.";

      setError(errorMessage);
      toast.error(errorMessage, {
        autoClose: 5000,
      });

      // Không chuyển hướng ngay lập tức, để hiển thị thông báo lỗi
      setTimeout(() => {
        navigate("/social");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      // Nếu có postId trong URL, tải bài post cụ thể
      fetchPostById(postId);
    } else {
      setSelectedPost(null);
      // Ngược lại tải tất cả bài post
      fetchPosts();
    }
  }, [postId]);

  const handlePostUpdate = async (postId, newContent, imageFile) => {
    try {
      let updatedPost;
      if (!user?.id) {
        toast.error("User info not found!");
        return;
      }

      // Nếu có imageFile, sử dụng API updatePostWithImage
      if (imageFile !== undefined) {
        updatedPost = await postService.updatePostWithImage(
          postId,
          newContent,
          imageFile,
          user?.id
        );
      } else {
        // Nếu chỉ cập nhật content, sử dụng API updatePost thông thường
        updatedPost = await postService.updatePost(postId, {
          content: newContent,
          userId: user?.id,
        });
      }

      // Cập nhật dữ liệu sau khi thành công
      if (selectedPost && selectedPost.id === postId) {
        // Nếu đang xem post cụ thể, cập nhật post đó
        fetchPostById(postId);
      } else {
        // Ngược lại, tải lại tất cả các post
        fetchPosts();
      }
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(
        "Post update failed: " +
          (error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      if (!user?.id) {
        toast.error("User info not found!");
        return;
      }
      await postService.deactivatePost(postId, {
        active: false,
        userId: user?.id,
      });

      // Xử lý sau khi xóa thành công
      if (selectedPost && selectedPost.id === postId) {
        // Nếu đang xem post cụ thể vừa bị xóa, chuyển về trang social
        navigate("/social");
      } else {
        // Ngược lại, tải lại tất cả các post
        fetchPosts();
      }
    } catch (error) {
      console.error("Error hiding post:", error);
      toast.error("Failed to hide the post");
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
        <Sidebar onPostCreated={fetchPosts} />
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
              <div className="text-center py-8 text-red-500">{error}</div>
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
      </div>
    </>
  );
};

export default SocialFeedPage;
