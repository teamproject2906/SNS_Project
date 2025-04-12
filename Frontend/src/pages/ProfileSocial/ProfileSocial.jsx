import React, { useState } from "react";
import PostCard from "../SocialFeedPage/component/PostCard/PostCard";
import { FaCog, FaHome, FaSearch, FaUser } from "react-icons/fa";

const ProfileSocial = () => {
  const [bio, setBio] = useState("Bio here"); // State để lưu bio
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa Bio
  const [newBio, setNewBio] = useState(bio); // State để lưu Bio mới khi người dùng chỉnh sửa

  // Hàm xử lý khi nhấn vào Edit Profile
  const handleEditProfile = () => {
    setIsEditing(true); // Mở chế độ chỉnh sửa
  };

  // Hàm xử lý khi lưu Bio mới
  const handleSaveBio = () => {
    setBio(newBio); // Cập nhật Bio mới
    setIsEditing(false); // Đóng chế độ chỉnh sửa
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 flex flex-col items-center justify-around p-4 h-100">
        <div className="space-y-6">
          <button className="text-2xl">
            <FaHome /> {/* Home */}
          </button>
          <button className="text-2xl">
            <FaSearch /> {/* Search */}
          </button>
          <button className="text-2xl">
            <FaUser /> {/* Profile */}
          </button>
          <button className="text-2xl">
            <FaCog /> {/* Settings */}
          </button>
        </div>
        <button className="text-2xl mt-auto bg-gray-700 rounded-full p-3 hover:bg-gray-600">
          + {/* Add Post Button */}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbiigxlSItMGEINLKB2wgjZ9b21BxWYei0mg&s"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-semibold text-2xl text-gray-800">User 1</h2>
            {/* Nếu đang chỉnh sửa thì hiển thị input, ngược lại hiển thị bio */}

            <p className="text-gray-600 text-sm mt-1">5 followers</p>
            {isEditing ? (
              <div className="flex flex-col w-[100%]  items-center">
                <textarea
                  className="mt-2 p-2 border rounded-lg w-full max-w-md"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)} // Cập nhật bio mới
                  rows="4"
                />
                <button
                  className="mt-4 w-[100%] border px-6 py-2 rounded-lg"
                  onClick={handleSaveBio} // Lưu bio mới
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="text-gray-600 text-sm mt-2">
                <p className="text-center">{bio}</p>
                <button
                  className="mt-4 border w-[100%] px-6 py-2 rounded-lg"
                  onClick={handleEditProfile} // Bật chế độ chỉnh sửa
                >
                  Edit profile
                </button>
              </div>
            )}
          </div>

          {/* PostCard */}
          <PostCard />
          <PostCard />
          <PostCard />
        </div>
      </div>
    </div>
  );
};

export default ProfileSocial;
