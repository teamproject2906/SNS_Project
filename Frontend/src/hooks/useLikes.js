import { useState, useCallback } from "react";
import { postService } from "../services/postService";
import { toast } from "react-toastify";

export const useLikes = (postId, initialLikes = 0, initialIsLiked = false, userId) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialIsLiked);
  const [likersList, setLikersList] = useState([]);
  const [loadingLikers, setLoadingLikers] = useState(false);

  const loadLikeStatus = useCallback(async () => {
    try {
      if (!postId) return;
      const response = await postService.checkLikeStatus(postId);

      if (response !== undefined) {
        setLiked(response.isLiked || false);
        if (response.likesCount !== undefined) {
          setLikes(response.likesCount);
        }
      }
    } catch (error) {
      console.error("Error loading like status:", error);
    }
  }, [postId]);

  const toggleLike = useCallback(async () => {
    try {
      if (!postId) return;
      if (!userId) {
        toast.error("User info not found!");
        return;
      }

      if (liked) {
        await postService.unlikePost(postId, userId);
        setLikes((prev) => prev - 1);
      } else {
        await postService.likePost(postId, userId);
        setLikes((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Cannot toggle like");
    }
  }, [postId, liked]);

  const fetchLikers = useCallback(async () => {
    if (!postId || loadingLikers) return;

    try {
      setLoadingLikers(true);
      const response = await postService.getPostLikers(postId);

      if (response) {
        setLikersList(response);
      }
    } catch (error) {
      console.error("Error fetching likers:", error);
      toast.error("Error fetching likers");
    } finally {
      setLoadingLikers(false);
    }
  }, [postId, loadingLikers]);

  return {
    likes,
    liked,
    likersList,
    loadingLikers,
    loadLikeStatus,
    toggleLike,
    fetchLikers,
  };
};
