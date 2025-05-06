import { useState, useCallback } from "react";
import { toast } from "react-toastify";

export const usePost = (post, onPostUpdate, onPostDelete) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditedContent(post?.content || "");
    setImagePreview(post?.imageUrl || null);
    setSelectedImage(null);
  }, [post?.content, post?.imageUrl]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedContent(post?.content || "");
    setSelectedImage(null);
    setImagePreview(null);
  }, [post?.content]);

  const handleImageChange = useCallback((file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editedContent.trim()) {
      toast.error("Nội dung bài viết không được để trống");
      return;
    }

    if (
      editedContent === post?.content &&
      !selectedImage &&
      post?.imageUrl === imagePreview
    ) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmitting(true);
      const imageFile = imagePreview === null ? undefined : selectedImage;
      await onPostUpdate(post.id, editedContent, imageFile);
      setIsEditing(false);
      toast.success("Bài viết đã được cập nhật");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(
        "Không thể cập nhật bài viết: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    editedContent,
    post?.content,
    post?.imageUrl,
    post?.id,
    selectedImage,
    imagePreview,
    onPostUpdate,
  ]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onPostDelete(post.id);
      toast.success("Bài viết đã được xóa");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Không thể xóa bài viết");
    } finally {
      setIsSubmitting(false);
    }
  }, [post?.id, onPostDelete]);

  return {
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
  };
};
