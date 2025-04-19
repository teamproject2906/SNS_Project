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

const PostCard = ({
  post,
  onPostUpdate,
  onPostDelete,
  showStatus,
  className,
}) => {
  const { user } = useUser();
  const [showComments, setShowComments] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showLikeTooltip, setShowLikeTooltip] = React.useState(false);
  const likeTooltipRef = useRef(null);
  const { commentCount, isLoading: commentsLoading } = useComments(post?.id);
  const [localCommentCount, setLocalCommentCount] =
    React.useState(commentCount);

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

  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleComments = () => setShowComments(!showComments);
  const toggleLikeTooltip = () => {
    setShowLikeTooltip(true);
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
  }, [showLikeTooltip]);

  useEffect(() => {
    setLocalCommentCount(commentCount); // cập nhật khi commentCount mới được fetch
  }, [commentCount]);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg mb-4 relative w-full ${className}`}
    >
      <PostHeader
        userAvatar={post?.userAvatar}
        fullName={
          post?.user?.trim() ||
          `${post?.username} (Full name has not been set yet)`
        }
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
      <div className="relative">
        <PostActions
          likes={likes}
          liked={liked}
          commentCount={localCommentCount}
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
      </div>

      {showComments && (
        <CommentSection
          postId={post?.id}
          currentUserId={user?.id}
          userAvatar={user?.avatar}
          isLoading={commentsLoading}
          onChangeCommentCount={setLocalCommentCount}
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
    username: PropTypes.string,
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
  className: PropTypes.string,
};

export default PostCard;
