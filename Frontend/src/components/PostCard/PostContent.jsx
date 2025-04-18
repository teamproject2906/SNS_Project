import React from "react";
import PropTypes from "prop-types";
import { FaImage } from "react-icons/fa";

const PostContent = ({
  isEditing,
  content,
  imageUrl,
  editedContent,
  setEditedContent,
  selectedImage,
  imagePreview,
  handleImageChange,
  handleRemoveImage,
  handleSave,
  handleCancel,
  isSubmitting,
}) => {
  if (!isEditing) {
    return (
      <div className="text-gray-800 mb-4">
        <p style={{ whiteSpace: "pre-line" }}>{content}</p>
        {imageUrl && (
          <div className="mt-3">
            <img
              src={imageUrl}
              alt="Post image"
              className="max-w-full h-auto rounded-lg object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/500x300?text=Ảnh+không+tồn+tại";
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <textarea
        className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows="4"
        disabled={isSubmitting}
        placeholder="Nội dung bài viết..."
      />

      <div className="mt-3">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              onClick={handleRemoveImage}
              disabled={isSubmitting}
            >
              <FaImage className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <label className="cursor-pointer text-blue-500 hover:text-blue-700">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files[0])}
                disabled={isSubmitting}
              />
              <FaImage className="mx-auto h-8 w-8 mb-2" />
              <span>Thêm hình ảnh</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          onClick={handleSave}
          disabled={isSubmitting || !editedContent.trim()}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </div>
  );
};

PostContent.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  content: PropTypes.string,
  imageUrl: PropTypes.string,
  editedContent: PropTypes.string,
  setEditedContent: PropTypes.func,
  selectedImage: PropTypes.object,
  imagePreview: PropTypes.string,
  handleImageChange: PropTypes.func,
  handleRemoveImage: PropTypes.func,
  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default PostContent;
