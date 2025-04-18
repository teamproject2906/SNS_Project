import React from "react";
import PropTypes from "prop-types";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";

const PostActions = ({
  likes,
  liked,
  commentCount,
  onToggleLike,
  onToggleComments,
  onToggleLikeTooltip,
  isSubmitting,
}) => {
  return (
    <div className="flex justify-between items-center mt-4 space-x-6">
      <div className="relative">
        <button
          className={`flex items-center ${
            liked ? "text-red-500" : "text-gray-600"
          } hover:text-gray-900 transition-colors duration-200`}
          onClick={onToggleLike}
          disabled={isSubmitting}
        >
          {liked ? (
            <FaHeart className="w-6 h-6" />
          ) : (
            <FaRegHeart className="w-6 h-6" />
          )}
          <span
            className="ml-2 text-sm cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLikeTooltip(e);
            }}
          >
            {likes}
          </span>
        </button>
      </div>

      <button
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        onClick={onToggleComments}
        disabled={isSubmitting}
      >
        <FaRegComment className="w-6 h-6" />
        <span className="ml-2">{commentCount} bình luận</span>
      </button>
    </div>
  );
};

PostActions.propTypes = {
  likes: PropTypes.number.isRequired,
  liked: PropTypes.bool.isRequired,
  commentCount: PropTypes.number.isRequired,
  onToggleLike: PropTypes.func.isRequired,
  onToggleComments: PropTypes.func.isRequired,
  onToggleLikeTooltip: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default PostActions;
