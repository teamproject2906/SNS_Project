import React from "react";
import PostCard from "./component/PostCard/PostCard";
import { FaCog, FaHome, FaSearch, FaUser } from "react-icons/fa";

const SocialFeedPage = () => {
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
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center mb-4">
            <input
              type="text"
              placeholder="Type something"
              className="flex-1 bg-gray-100 p-3 rounded-lg text-gray-800 focus:outline-none"
            />
            <button className="ml-4 border px-6 py-2 rounded-lg">
              Post
            </button>
          </div>

          {/* PostCard */}
          <div className="space-y-4">
            <PostCard />
            <PostCard />
            <PostCard />
          </div>
        </div>
      </div>

    </div>
  );
};

export default SocialFeedPage;
