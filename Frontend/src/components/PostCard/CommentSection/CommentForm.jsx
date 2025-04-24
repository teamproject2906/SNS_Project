import React from "react";
import PropTypes from "prop-types";
import { FaPaperPlane } from "react-icons/fa";
import { DEFAULT_AVATAR } from "../../../constants/ImageConstant";
import { useUser } from "../../../context/UserContext";

const CommentForm = ({
  commentText,
  setCommentText,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditing,
  placeholder,
}) => {
  const { user } = useUser();
  const userAvatar = user?.avatar || DEFAULT_AVATAR;
  return (
    <div className="flex gap-2 mb-4">
      <div className="w-9 h-9 rounded-full overflow-hidden">
        <img
          src={userAvatar || DEFAULT_AVATAR}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 relative">
        <textarea
          className="w-full p-2 border rounded-lg text-sm"
          placeholder={
            placeholder ||
            (isEditing ? "Edit your comment..." : "Write your comment...")
          }
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="2"
          disabled={isSubmitting}
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
          {onCancel && (
            <button
              className="text-gray-500 disabled:text-gray-400 text-sm mr-2"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            className="text-blue-500 disabled:text-gray-400"
            onClick={onSubmit}
            disabled={isSubmitting || !commentText.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  userAvatar: PropTypes.string,
  commentText: PropTypes.string.isRequired,
  setCommentText: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isEditing: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default CommentForm;
