import { useState, useCallback, useEffect } from "react";
import { commentService } from "../services/commentService";
import { toast } from "react-toastify";
import { buildCommentTree } from "../utils/commentUtils";

export const useComments = (postId, userId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  const loadComments = useCallback(async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      const response = await commentService.getCommentsByPostId(postId);

      if (response) {
        // Chuyển đổi thành cấu trúc phân cấp và lọc theo active
        const activeComments = response.filter((comment) => comment.active);
        const treeComments = buildCommentTree(activeComments);

        setComments(treeComments);
        setCommentCount(activeComments.length);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Load comments khi postId thay đổi
  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId, loadComments]);

  const addComment = useCallback(
    async (content, userId) => {
      if (!content.trim() || !postId || !userId) return;

      try {
        setIsLoading(true);
        const commentData = {
          content: content.trim(),
          postId,
          userId,
          active: true,
        };

        const response = await commentService.createComment(commentData);

        if (response) {
          await loadComments();
          toast.success("Đã thêm bình luận thành công");
          return response;
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Không thể thêm bình luận");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [postId, loadComments]
  );

  const addReply = useCallback(
    async (parentId, content) => {
      if (!content.trim() || !postId || !parentId) return;

      try {
        setIsLoading(true);
        const replyData = {
          content: content.trim(),
          postId,
          commentReplyId: parentId,
          userId,
          active: true,
        };

        const response = await commentService.createComment(replyData);
        if (response) {
          await loadComments();
          toast.success("Đã thêm phản hồi thành công");
          return response;
        }
      } catch (error) {
        console.error("Error adding reply:", error);
        toast.error("Không thể thêm phản hồi");
      } finally {
        setIsLoading(false);
      }
    },
    [postId, loadComments]
  );

  const updateComment = useCallback(
    async (commentId, content) => {
      if (!commentId || !content.trim()) return;

      try {
        setIsLoading(true);
        const response = await commentService.updateComment(commentId, {
          content,
          postId,
          userId,
          active: true,
        });

        if (response) {
          await loadComments(); // Reload để có cấu trúc mới nhất
          setEditingComment(null);
          toast.success("Đã cập nhật bình luận");
        }
      } catch (error) {
        console.error("Error updating comment:", error);
        toast.error("Không thể cập nhật bình luận");
      } finally {
        setIsLoading(false);
      }
    },
    [postId, loadComments]
  );

  const deleteComment = useCallback(
    async (commentId) => {
      if (!commentId) return;

      try {
        setIsLoading(true);
        await commentService.deleteComment(commentId, {
          postId,
          userId,
          active: false,
        });
        await loadComments(); // Reload để có cấu trúc mới nhất
        toast.success("Đã xóa bình luận");
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Không thể xóa bình luận");
      } finally {
        setIsLoading(false);
      }
    },
    [postId, loadComments]
  );

  return {
    comments,
    isLoading,
    commentCount,
    addComment,
    addReply,
    updateComment,
    deleteComment,
    replyText,
    setReplyText,
    replyingTo,
    setReplyingTo,
    editingComment,
    setEditingComment,
  };
};
