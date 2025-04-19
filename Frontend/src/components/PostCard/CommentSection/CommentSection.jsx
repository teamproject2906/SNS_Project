import { useState } from "react";
import PropTypes from "prop-types";
import { useComments } from "../../../hooks/useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { MAX_VISIBLE_REPLIES } from "../../../utils/constants";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2 } from "lucide-react";

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-red-700 font-medium mb-2">Error loading comments</h3>
    <p className="text-red-600 mb-3">{error.message}</p>
    <button
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      onClick={resetErrorBoundary}
    >
      Try again
    </button>
  </div>
);

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

const CommentSection = ({
  postId,
  currentUserId,
  userAvatar,
  onChangeCommentCount,
}) => {
  const {
    deleteComment: deleteCommentHook,
    addReply,
    updateComment: updateCommentHook,
    comments: commentsList,
    isLoading,
    addComment,
  } = useComments(postId);

  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [error, setError] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUserId) return;
    try {
      await addComment(newComment, currentUserId);
      setNewComment("");
      onChangeCommentCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment");
    }
  };

  const handlePostReply = async (commentId) => {
    const replyContent = replyText[commentId];
    if (!replyContent?.trim()) return;
    try {
      await addReply(commentId, replyContent);
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
      onChangeCommentCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error posting reply:", error);
      setError("Failed to post reply");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await updateCommentHook(commentId, editText);
      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating comment:", error);
      setError("Failed to update comment");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const countNestedComments = (comments, parentId) => {
    let total = 0;

    const findAndCount = (commentList) => {
      for (const comment of commentList) {
        if (comment.id === parentId) {
          total += countAllNested(comment);
          break;
        } else if (comment.replies && comment.replies.length > 0) {
          findAndCount(comment.replies);
        }
      }
    };

    const countAllNested = (comment) => {
      let count = 1; // tính chính nó
      if (comment.replies && comment.replies.length > 0) {
        for (const reply of comment.replies) {
          count += countAllNested(reply);
        }
      }
      return count;
    };

    findAndCount(comments);
    return total;
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentHook(commentId);
      onChangeCommentCount(
        (prev) => prev - countNestedComments(commentsList, commentId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
  };

  const renderReplies = (replies, level = 1, parentId) => {
    if (!replies || !replies.length) return null;

    const isExpanded = expandedReplies[parentId];
    const visibleReplies = isExpanded
      ? replies
      : replies.slice(0, MAX_VISIBLE_REPLIES);
    const hiddenCount = replies.length - visibleReplies.length;

    return (
      <div className="transition-all duration-500">
        {visibleReplies.map((reply) => {
          const name =
            reply?.firstName?.toString()?.trim() &&
            reply?.firstName?.toString()?.trim() !== ""
              ? reply?.firstName + " " + reply?.lastName
              : reply?.username;
          return (
            <div key={reply.id} className="mt-2">
              {editingComment === reply.id ? (
                <div className="ml-11 mt-2">
                  <CommentForm
                    userAvatar={userAvatar}
                    commentText={editText}
                    setCommentText={setEditText}
                    onSubmit={() => handleUpdateComment(reply.id)}
                    onCancel={handleCancelEdit}
                    isSubmitting={isLoading}
                    placeholder="Chỉnh sửa bình luận..."
                  />
                </div>
              ) : (
                <CommentItem
                  comment={reply}
                  level={level}
                  onReply={() => handleReplyClick(reply.id, name)}
                  replyingToId={replyingTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  onPostReply={handlePostReply}
                  isSubmitting={isLoading}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  currentUserId={currentUserId}
                />
              )}
              {reply.replies &&
                reply.replies.length > 0 &&
                renderReplies(reply.replies, level + 1, reply.id)}
            </div>
          );
        })}

        {replies.length > MAX_VISIBLE_REPLIES && (
          <button
            className="ml-6 text-xs text-gray-700 font-semibold hover:underline mt-2 bg-transparent border-none outline-none cursor-pointer"
            onClick={() =>
              setExpandedReplies({
                ...expandedReplies,
                [parentId]: !isExpanded,
              })
            }
          >
            {isExpanded ? (
              <>
                <BsChevronUp className="inline" /> Thu gọn phản hồi
              </>
            ) : (
              <>
                <BsChevronDown className="inline" /> Xem {hiddenCount} phản hồi
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const handleReplyClick = (commentId, authorName) => {
    setReplyingTo(commentId);
    setReplyText((prev) => ({
      ...prev,
      [commentId]: `@${authorName} `,
    }));
  };

  const renderComments = (commentsList) => {
    if (!commentsList || !commentsList.length) {
      return (
        <p className="text-gray-500 text-center py-4">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </p>
      );
    }

    return commentsList.map((comment) => {
      const name =
        comment?.firstName?.toString()?.trim() &&
        comment?.firstName?.toString()?.trim() !== ""
          ? comment?.firstName + " " + comment?.lastName
          : comment?.username;

      return (
        <div key={comment.id} className="mb-4">
          {editingComment === comment.id ? (
            <div className="ml-11 mt-2">
              <CommentForm
                userAvatar={userAvatar}
                commentText={editText}
                setCommentText={setEditText}
                onSubmit={() => handleUpdateComment(comment.id)}
                onCancel={handleCancelEdit}
                isSubmitting={isLoading}
                placeholder="Chỉnh sửa bình luận..."
              />
            </div>
          ) : (
            <CommentItem
              comment={comment}
              level={0}
              onReply={() => handleReplyClick(comment.id, name)}
              replyingToId={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onPostReply={handlePostReply}
              isSubmitting={isLoading}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              currentUserId={currentUserId}
            />
          )}
          {comment.replies &&
            comment.replies.length > 0 &&
            renderReplies(comment.replies, 1, comment.id)}
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="comment-section-loading flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-4">
        <CommentForm
          userAvatar={userAvatar}
          commentText={newComment}
          setCommentText={setNewComment}
          onSubmit={handleSubmitComment}
          isSubmitting={isLoading}
          placeholder="Viết bình luận của bạn..."
        />
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      <div className="space-y-4">{renderComments(commentsList)}</div>
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
  onCreateComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  userAvatar: PropTypes.string,
};

CommentSection.defaultProps = {
  onCreateComment: () => {},
  onDeleteComment: () => {},
  currentUserId: null,
};

const CommentSectionWithErrorBoundary = (props) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // Reset the error boundary state
      if (props.postId) {
        // Re-fetch comments will happen automatically through the hook
      }
    }}
  >
    <CommentSection {...props} />
  </ErrorBoundary>
);

CommentSectionWithErrorBoundary.propTypes = {
  postId: PropTypes.string.isRequired,
  ...CommentSection.propTypes,
};

export default CommentSectionWithErrorBoundary;
