import PropTypes from "prop-types";
import { CiSettings } from "react-icons/ci";
import { DEFAULT_AVATAR } from "../../constants/ImageConstant";
import { getTimeAgo } from "../../utils/timeUtils";

const PostHeader = ({
  createdAt,
  userAvatar,
  fullName,
  isCurrentUser,
  showSettings,
  toggleSettings,
  onEdit,
  onDelete,
  onReport,
  showStatus,
  isActive,
}) => {
  return (
    <div className="flex items-center mb-4 relative pt-6 px-6">
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        onClick={toggleSettings}
      >
        <CiSettings className="w-6 h-6" />
      </button>

      {showSettings && (
        <div className="absolute top-12 right-3 bg-white shadow-lg rounded-lg border p-3 w-40 z-50">
          <ul>
            {isCurrentUser ? (
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
            ) : (
              <li
                className="text-gray-700 hover:bg-gray-200 p-2 cursor-pointer"
                onClick={onReport}
              >
                Report
              </li>
            )}
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
      <div className="ml-3 flex flex-col items-start justify-center">
        <h2 className="font-semibold text-xl text-gray-800">
          {fullName || "(User has not set a name)"}
        </h2>
        {createdAt && (
          <span className="text-gray-500 text-sm">{getTimeAgo(createdAt)}</span>
        )}
      </div>

      {showStatus && isActive !== undefined && (
        <div
          className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Displaying..." : "Deleted"}
        </div>
      )}
    </div>
  );
};

PostHeader.propTypes = {
  userAvatar: PropTypes.string,
  fullName: PropTypes.string,
  isCurrentUser: PropTypes.bool.isRequired,
  showSettings: PropTypes.bool.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showStatus: PropTypes.bool,
  isActive: PropTypes.bool,
  onReport: PropTypes.func.isRequired,
  createdAt: PropTypes.string,
};

export default PostHeader;
