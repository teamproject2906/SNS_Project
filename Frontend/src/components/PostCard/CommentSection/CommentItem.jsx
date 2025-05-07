import PropTypes from "prop-types";
import { FaEdit, FaTrash, FaRegComment } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { getTimeAgo } from "../../../utils/timeUtils";
import CommentForm from "./CommentForm";
import { DEFAULT_AVATAR } from "../../../constants/ImageConstant";

const CommentItem = ({
  comment,
  level = 0,
  onReply,
  replyingToId,
  replyText,
  setReplyText,
  onPostReply,
  isSubmitting,
  onEditComment,
  onDeleteComment,
  currentUserId,
}) => {
  const bgClass = level > 0 ? "bg-gray-50" : "bg-white";
  const isCommentOwner = currentUserId === comment.userId;
  const indentLevel = Math.min(level, 3); // tối đa 3 cấp
  const marginLeft = indentLevel * 24; // 16px mỗi cấp
  const name =
    comment?.firstName &&
    comment?.lastName &&
    comment?.firstName?.toString()?.trim() &&
    comment?.firstName?.toString()?.trim() !== ""
      ? comment?.firstName + " " + comment?.lastName
      : comment?.username;

  return (
    <div
      className={`flex flex-col gap-2 ${
        level > 0 ? "border-l-2 border-gray-200 pl-4" : "border-t"
      }`}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={comment?.avatar || DEFAULT_AVATAR}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`${bgClass} rounded-lg shadow-sm`}>
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-sm text-gray-900">{name}</h4>
              {isCommentOwner && (
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => onEditComment(comment)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this comment?"
                        )
                      ) {
                        onDeleteComment(comment.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 break-words">
              {comment.content}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <BsClock className="w-3.5 h-3.5" />
                <span>
                  {comment.createdAt
                    ? getTimeAgo(comment.createdAt)
                    : "Just now"}
                </span>
              </div>
              <button
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                onClick={onReply}
                disabled={isSubmitting}
              >
                <FaRegComment
                  className={`${level > 0 ? "w-3 h-3" : "w-3.5 h-3.5"}`}
                />
                <span>Reply</span>
              </button>
            </div>
          </div>

          {replyingToId === comment.id && (
            <div className="mt-3">
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <div className="border-b border-gray-200">
                  <p className="text-xs text-gray-600">
                    Reply to{" "}
                    <span className="font-semibold">
                      {comment?.firstName + " " + comment?.lastName ||
                        "(Unnamed user)"}
                    </span>
                  </p>
                </div>
                <div className="p-3">
                  <CommentForm
                    commentText={replyText[comment.id] || ""}
                    setCommentText={(value) =>
                      setReplyText({
                        ...replyText,
                        [comment.id]: value,
                      })
                    }
                    isSubmitting={isSubmitting}
                    onSubmit={() =>
                      onPostReply(comment.id, level + 1, comment.userId)
                    }
                    onCancel={() => onReply(null)}
                    placeholder="Write your answer..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  level: PropTypes.number,
  onReply: PropTypes.func.isRequired,
  replyingToId: PropTypes.string,
  replyText: PropTypes.object.isRequired,
  setReplyText: PropTypes.func.isRequired,
  onPostReply: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default CommentItem;
