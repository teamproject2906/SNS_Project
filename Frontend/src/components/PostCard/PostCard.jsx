import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useUser } from "../../context/UserContext";
import { usePost } from "../../hooks/usePost";
import { useLikes } from "../../hooks/useLikes";
import { useComments } from "../../hooks/useComments";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection/CommentSection";
import LikeTooltip from "./LikeTooltip";

const PostCard = ({ post, onPostUpdate, onPostDelete, showStatus }) => {
  const { user } = useUser();
  const [showComments, setShowComments] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showLikeTooltip, setShowLikeTooltip] = React.useState(false);
  const likeTooltipRef = useRef(null);

  const {
    isEditing,
    editedContent,
    selectedImage,
    imagePreview,
    isSubmitting,
    setEditedContent,
    handleEdit,
    handleCancel,
    handleImageChange,
    handleRemoveImage,
    handleSave,
    handleDelete,
  } = usePost(post, onPostUpdate, onPostDelete);

  const {
    likes,
    liked,
    likersList,
    loadingLikers,
    loadLikeStatus,
    toggleLike,
    fetchLikers,
  } = useLikes(post?.id, post?.likes, post?.isLiked);

  const {
    commentCount,
    addComment,
    deleteComment,
    isLoading: commentsLoading,
  } = useComments(post?.id);

  const handleCommentCreate = async (content) => {
    if (!content.trim() || !user?.id) return;

    try {
      const newComment = await addComment(content, user.id);

      if (newComment) {
        setShowComments(true);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    if (post?.id) {
      loadLikeStatus();
    }
  }, [post?.id, loadLikeStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        likeTooltipRef.current &&
        !likeTooltipRef.current.contains(event.target)
      ) {
        setShowLikeTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showLikeTooltip) {
      fetchLikers();
    }
  }, [showLikeTooltip, fetchLikers]);

  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleComments = () => setShowComments(!showComments);
  const toggleLikeTooltip = (e) => {
    e.stopPropagation();
    setShowLikeTooltip(!showLikeTooltip);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-4 relative">
      <PostHeader
        userAvatar={post?.userAvatar}
        username={post?.user}
        isCurrentUser={user?.id === post?.userId}
        showSettings={showSettings}
        toggleSettings={toggleSettings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showStatus={showStatus}
        isActive={post?.isActive}
      />

      <PostContent
        isEditing={isEditing}
        content={post?.content}
        imageUrl={post?.imageUrl}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        selectedImage={selectedImage}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
        handleRemoveImage={handleRemoveImage}
        handleSave={handleSave}
        handleCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      <PostActions
        likes={likes}
        liked={liked}
        commentCount={commentCount}
        onToggleLike={toggleLike}
        onToggleComments={toggleComments}
        onToggleLikeTooltip={toggleLikeTooltip}
        isSubmitting={isSubmitting}
      />

      {showLikeTooltip && (
        <LikeTooltip
          ref={likeTooltipRef}
          likes={likes}
          likersList={likersList}
          loadingLikers={loadingLikers}
          currentUserId={user?.id}
        />
      )}

      {showComments && (
        <CommentSection
          postId={post?.id}
          currentUserId={user?.id}
          userAvatar={user?.avatar}
          userId={user?.id}
          onCreateComment={handleCommentCreate}
          onDeleteComment={handleCommentDelete}
          isLoading={commentsLoading}
        />
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    userAvatar: PropTypes.string,
    user: PropTypes.string,
    userId: PropTypes.number,
    likes: PropTypes.number,
    isLiked: PropTypes.bool,
    isActive: PropTypes.bool,
  }).isRequired,
  onPostUpdate: PropTypes.func.isRequired,
  onPostDelete: PropTypes.func.isRequired,
  showStatus: PropTypes.bool,
};

export default PostCard;
