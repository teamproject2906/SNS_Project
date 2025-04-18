import PropTypes from "prop-types";
import { FaEdit, FaTrash, FaRegComment } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { getTimeAgo } from "../../../utils/timeUtils";
import CommentForm from "./CommentForm";

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

  return (
    <div
      className={`flex flex-col gap-2 ${
        level > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : "border-b pb-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={
              comment?.avatar ||
              `https://i.pravatar.cc/100?img=${(comment.id % 10) + 1}`
            }
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`${bgClass} rounded-lg p-3 shadow-sm`}>
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-sm text-gray-900">
                {comment?.lastName + " " + comment?.firstName ||
                  "(Người dùng chưa đặt tên)"}
              </h4>
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
                          "Bạn có chắc chắn muốn xóa bình luận này?"
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
                    ? getTimeAgo(new Date(comment.createdAt).getTime())
                    : "Vừa xong"}
                </span>
              </div>
              <button
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                onClick={() => onReply(comment.id)}
                disabled={isSubmitting}
              >
                <FaRegComment
                  className={`${level > 0 ? "w-3 h-3" : "w-3.5 h-3.5"}`}
                />
                <span>Trả lời</span>
              </button>
            </div>
          </div>

          {replyingToId === comment.id && (
            <div className="mt-3">
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-xs text-gray-600">
                    Trả lời bình luận của{" "}
                    <span className="font-semibold">
                      {comment?.lastName + " " + comment?.firstName ||
                        "(Người dùng chưa đặt tên)"}
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
                    placeholder="Viết câu trả lời của bạn..."
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
