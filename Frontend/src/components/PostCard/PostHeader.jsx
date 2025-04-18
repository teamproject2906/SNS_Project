import React from "react";
import PropTypes from "prop-types";
import { CiSettings } from "react-icons/ci";
import { DEFAULT_AVATAR } from "../../constants/ImageConstant";

const PostHeader = ({
  userAvatar,
  username,
  isCurrentUser,
  showSettings,
  toggleSettings,
  onEdit,
  onDelete,
  showStatus,
  isActive,
}) => {
  return (
    <div className="flex items-center mb-4 relative">
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        onClick={toggleSettings}
      >
        <CiSettings className="w-6 h-6" />
      </button>

      {showSettings && (
        <div className="absolute top-12 right-3 bg-white shadow-lg rounded-lg border p-3 w-40 z-50">
          <ul>
            {isCurrentUser && (
              <>
                <li
                  className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer"
                  onClick={onEdit}
                >
                  Edit Post
                </li>
                <li
                  className="text-red-500 hover:bg-gray-200 p-2 cursor-pointer"
                  onClick={onDelete}
                >
                  Delete Post
                </li>
              </>
            )}
            <li className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer">
              Report
            </li>
          </ul>
        </div>
      )}

      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
        <img
          src={userAvatar || DEFAULT_AVATAR}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-3 flex items-center">
        <h2 className="font-semibold text-xl text-gray-800">
          {username || "(Người dùng chưa đặt tên)"}
        </h2>
        {!isCurrentUser && (
          <button className="ml-4 text-blue-500 text-sm font-medium hover:underline">
            Follow
          </button>
        )}
      </div>

      {showStatus && isActive !== undefined && (
        <div
          className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Đang hiển thị" : "Đã xóa"}
        </div>
      )}
    </div>
  );
};

PostHeader.propTypes = {
  userAvatar: PropTypes.string,
  username: PropTypes.string,
  isCurrentUser: PropTypes.bool.isRequired,
  showSettings: PropTypes.bool.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showStatus: PropTypes.bool,
  isActive: PropTypes.bool,
};

export default PostHeader;
