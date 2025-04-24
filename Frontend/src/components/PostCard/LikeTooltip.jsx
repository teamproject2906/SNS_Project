import React from "react";
import PropTypes from "prop-types";
import { DEFAULT_AVATAR } from "../../constants/ImageConstant";

const LikeTooltip = React.forwardRef(
  ({ likes, likersList, loadingLikers, currentUserId }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg p-3 w-64 z-50 border border-gray-200"
      >
        <h4 className="font-semibold text-gray-700 mb-2 pb-1 border-b">
          Likes ({likes})
        </h4>

        {loadingLikers ? (
          <div className="py-3 text-center text-gray-500">
            <span className="inline-block animate-spin mr-2">⟳</span>
            Loading...
          </div>
        ) : likersList.length > 0 ? (
          <ul className="max-h-60 overflow-y-auto">
            {likersList.map((liker) => (
              <li key={liker.userID} className="py-2 flex items-center gap-2">
                <img
                  src={liker.avatar || DEFAULT_AVATAR}
                  alt={liker.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{liker.fullName}</span>
                {currentUserId === liker.userID && (
                  <span className="ml-auto text-xs text-blue-500">Your</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-3 text-center text-gray-500">
            No likes yet
          </p>
        )}
      </div>
    );
  }
);

LikeTooltip.displayName = "LikeTooltip";

LikeTooltip.propTypes = {
  likes: PropTypes.number.isRequired,
  likersList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    })
  ).isRequired,
  loadingLikers: PropTypes.bool.isRequired,
  currentUserId: PropTypes.number.isRequired,
};

export default LikeTooltip;
