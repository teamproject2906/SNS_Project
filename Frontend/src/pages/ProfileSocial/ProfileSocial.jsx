import { useEffect, useMemo, useState } from "react";
import PostCard from "../../components/PostCard";
import Header from "../../layouts/common/Header";
import Sidebar from "../../components/Social/Sidebar";
import { useUser } from "../../context/UserContext";
import { getToken } from "../Login/app/static";
import userService from "../../services/userService";
import { DEFAULT_AVATAR } from "../../constants/ImageConstant";
import postService from "../../services/postService";
import { toast } from "react-toastify";

const ProfileSocial = () => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(user);
  const [posts, setPosts] = useState([]);

  const name = useMemo(() => {
    return userProfile?.firstname?.toString()?.trim() &&
      userProfile?.lastname?.toString()?.trim() !== ""
      ? userProfile?.firstname + " " + userProfile?.lastname
      : userProfile?.username;
  }, [userProfile]);

  const token = getToken();

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return null;
    }
  };

  const fetchPosts = async () => {
    try {
      const posts = await postService.getPostsByUserId(userProfile?.id);
      setPosts(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

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

      // Ngược lại, tải lại tất cả các post
      fetchPosts();

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
      await postService.deactivatePost(postId, {
        active: false,
      });

      fetchPosts();

      toast.success("Ẩn bài viết thành công");
    } catch (error) {
      console.error("Error hiding post:", error);
      toast.error("Ẩn bài viết thất bại");
    }
  };

  // Debug thông tin user
  useEffect(() => {
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const decodedToken = parseJwt(token);
          const userId = decodedToken?.userId;

          if (!userId) return;

          const response = await userService.getUserProfile(userId);
          setUserProfile(response);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [userProfile?.id]);

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar onPostCreated={fetchPosts} />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center mb-6">
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col items-start max-w-[80%] justify-between gap-3">
                  <h2
                    className="font-bold text-2xl line-clamp-1"
                    style={{ lineHeight: "30px" }}
                  >
                    {name}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {userProfile?.bio}
                  </p>
                </div>
                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <img
                    src={userProfile?.avatar || DEFAULT_AVATAR}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full flex-1 flex flex-col items-center justify-center mt-10">
                {posts.map((post) => (
                  <PostCard
                    className="border-t border-gray-300 mb-2 shadow-none rounded-none"
                    key={post.id}
                    post={post}
                    onPostUpdate={handlePostUpdate}
                    onPostDelete={handlePostDelete}
                    showStatus={true}
                  />
                ))}
              </div>
            </div>

            {/* PostCard */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSocial;
