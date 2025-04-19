import { useEffect, useMemo, useState } from "react";
import PostCard from "../../components/PostCard";
import Header from "../../layouts/common/Header";
import Sidebar from "../../components/Social/Sidebar";
import { useUser } from "../../context/UserContext";
import { getToken } from "../Login/app/static";
import userService from "../../services/userService";
import { DEFAULT_AVATAR } from "../../constants/ImageConstant";
import postService from "../../services/postService";

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
                <div className="flex flex-col items-start max-w-[30%] justify-between gap-3">
                  <div className="flex flex-col">
                    <h2
                      className="font-semibold text-2xl text-gray-800"
                      style={{ lineHeight: "28px" }}
                    >
                      {name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {userProfile?.username}
                    </p>
                  </div>
                  <div className="flex flex-row items-start justify-between gap-1">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {userProfile?.bio}
                    </p>
                  </div>
                </div>
                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <img
                    src={userProfile?.avatar || DEFAULT_AVATAR}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full flex-1 flex flex-col items-center justify-center mt-5">
                <div className="mx-auto mb-5">
                  <h2 className="text-2xl font-bold border-b-4 px-1 border-gray-300 text-center">
                    POSTS
                  </h2>
                </div>
                {posts.map((post) => (
                  <PostCard
                    className="outline-2 outline-double"
                    key={post.id}
                    post={post}
                    onPostUpdate={() => {}}
                    onPostDelete={() => {}}
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
