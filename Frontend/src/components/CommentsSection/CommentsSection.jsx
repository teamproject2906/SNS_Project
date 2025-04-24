import { useState, useEffect } from "react";
import api from "../../pages/Login/app/api";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CommentsSection = ({ productId }) => {
  const [token, setTokenState] = useState(
    localStorage.getItem("AUTH_TOKEN")?.replace(/^"|"$/g, "")
  );
  const { user } = useUser();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    content: "",
    rating: 0,
    file: null,
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null); // Theo dõi feedback đang chỉnh sửa
  const [editComment, setEditComment] = useState({
    content: "",
    rating: 0,
    file: null,
  });
  const [editHoverRating, setEditHoverRating] = useState(0); // Hover rating cho form chỉnh sửa

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  const decodedToken = parseJwt(token);
  const userId = decodedToken?.userId;

  // Fetch feedbacks
  useEffect(() => {
    if (productId) {
      fetchFeedbacks();
    }
  }, [productId]);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get(`/api/feedbacks/product/${productId}`);
      console.log("Feedbacks from backend:", response.data);
      const feedbacks = response.data;

      const feedbacksWithFullName = await Promise.all(
        feedbacks.map(async (comment) => {
          let fullName = "Unknown User";
          try {
            const userResponse = await api.get(
              `/User/getUserProfile/${comment.userId}`
            );
            console.log(
              `User data for userId ${comment.userId}:`,
              userResponse.data
            );
            const firstname = userResponse.data?.firstname || "";
            const lastname = userResponse.data?.lastname || "";
            fullName = `${firstname} ${lastname}`.trim() || "Unknown User";
          } catch (error) {
            console.error(
              `Failed to fetch user data for userId ${comment.userId}:`,
              {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
              }
            );
          }

          const createdAt = comment.createdAt
            ? new Date(comment.createdAt)
                .toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(",", "")
            : new Date()
                .toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(",", "");

          return {
            ...comment,
            fullName,
            date: createdAt,
            expanded: false,
          };
        })
      );

      setComments(feedbacksWithFullName);
    } catch (error) {
      console.error("Error fetching feedbacks:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load feedbacks!"
      );
    }
  };

  // Handle submit new feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a feedback!");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const dto = {
      comment: newComment.content,
      rate: newComment.rating,
      productId: parseInt(productId),
      userId: userId,
    };
    console.log("DTO being sent:", dto);

    const formData = new FormData();
    formData.append("dto", JSON.stringify(dto));
    formData.append("file", newComment.file || ""); // Explicitly handle no file

    console.log("Submitting formData:", Object.fromEntries(formData)); // Debugging

    try {
      const response = await api.post("/api/feedbacks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response from backend:", response.data);
      await fetchFeedbacks();
      setNewComment({ content: "", rating: 0, file: null });
      setHoverRating(0);
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit feedback!"
      );
    }
  };

  // Handle edit feedback
  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditComment({
      content: comment.comment,
      rating: comment.rate,
      file: null,
    });
    setEditHoverRating(comment.rate);
  };

  const handleEditSubmit = async (e, commentId) => {
    e.preventDefault();
    const dto = {
      comment: editComment.content,
      rate: editComment.rating,
      productId: parseInt(productId),
      userId: userId,
    };
    console.log("Edit DTO being sent:", dto);

    const formData = new FormData();
    formData.append("dto", JSON.stringify(dto));
    if (editComment.file) {
      formData.append("file", editComment.file);
    }

    try {
      const response = await api.put(`/api/feedbacks/${commentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Edit response from backend:", response.data);
      await fetchFeedbacks();
      setEditingCommentId(null);
      setEditComment({ content: "", rating: 0, file: null });
      setEditHoverRating(0);
      toast.success("Feedback updated successfully!");
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update feedback!"
      );
    }
  };

  // Handle delete feedback
  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await api.delete(`/api/feedbacks/${commentId}`);
        await fetchFeedbacks();
        toast.success("Feedback deleted successfully!");
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete feedback!"
        );
      }
    }
  };

  const toggleFullText = (index) => {
    setComments(
      comments.map((comment, i) =>
        i === index ? { ...comment, expanded: !comment.expanded } : comment
      )
    );
  };

  const handleRatingClick = (rating) => {
    setNewComment({ ...newComment, rating });
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleEditRatingClick = (rating) => {
    setEditComment({ ...editComment, rating });
  };

  const handleEditRatingHover = (rating) => {
    setEditHoverRating(rating);
  };

  const handleEditRatingLeave = () => {
    setEditHoverRating(0);
  };

  return (
    <div className="commentsSection">
      <div className="commentForm bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-2xl font-semibold mb-4">Add a Comment</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            placeholder="Write your comment..."
            className="w-full p-2 border rounded mb-2"
            disabled={!user}
          />
          <input
            type="file"
            onChange={(e) =>
              setNewComment({ ...newComment, file: e.target.files[0] })
            }
            className="mb-2"
            disabled={!user}
          />
          <div className="ratingInput mb-2 flex items-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const currentRating = hoverRating || newComment.rating;
              const isFull = currentRating >= star;
              const isHalf =
                currentRating >= star - 0.5 && currentRating < star;

              return (
                <span
                  key={star}
                  className="star relative inline-block text-2xl cursor-pointer"
                  onMouseEnter={() =>
                    !user ? null : handleRatingHover(star - 0.5)
                  }
                  onMouseMove={(e) => {
                    if (!user) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const half = x < rect.width / 2;
                    handleRatingHover(half ? star - 0.5 : star);
                  }}
                  onMouseLeave={() => (!user ? null : handleRatingLeave())}
                  onClick={() =>
                    !user ? null : handleRatingClick(hoverRating || star - 0.5)
                  }
                >
                  <span className="empty-star text-gray-300">★</span>
                  <span
                    className="filled-star absolute top-0 left-0 text-yellow-400 overflow-hidden"
                    style={{
                      width: isFull ? "100%" : isHalf ? "50%" : "0%",
                    }}
                  >
                    ★
                  </span>
                </span>
              );
            })}
            <span className="ml-2 text-gray-600">
              {newComment.rating > 0
                ? `${newComment.rating} stars`
                : "Select rating"}
            </span>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={!user}
          >
            Submit
          </button>
        </form>
        {!user && (
          <p className="text-red-500 mt-2">Log in to submit feedback!</p>
        )}
      </div>

      <div className="commentList bg-white shadow-md rounded-lg p-4">
        <h3 className="text-2xl font-semibold mb-4">Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="commentItem border-t pt-4 mt-4">
            {editingCommentId === comment.id ? (
              // Form chỉnh sửa feedback
              <form
                onSubmit={(e) => handleEditSubmit(e, comment.id)}
                className="mb-4"
              >
                <textarea
                  value={editComment.content}
                  onChange={(e) =>
                    setEditComment({ ...editComment, content: e.target.value })
                  }
                  placeholder="Edit your comment..."
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setEditComment({ ...editComment, file: e.target.files[0] })
                  }
                  className="mb-2"
                />
                <div className="ratingInput mb-2 flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const currentRating = editHoverRating || editComment.rating;
                    const isFull = currentRating >= star;
                    const isHalf =
                      currentRating >= star - 0.5 && currentRating < star;

                    return (
                      <span
                        key={star}
                        className="star relative inline-block text-2xl cursor-pointer"
                        onMouseEnter={() => handleEditRatingHover(star - 0.5)}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const half = x < rect.width / 2;
                          handleEditRatingHover(half ? star - 0.5 : star);
                        }}
                        A
                        onMouseLeave={() => handleEditRatingLeave()}
                        onClick={() =>
                          handleEditRatingClick(editHoverRating || star - 0.5)
                        }
                      >
                        <span className="empty-star text-gray-300">★</span>
                        <span
                          className="filled-star absolute top-0 left-0 text-yellow-400 overflow-hidden"
                          style={{
                            width: isFull ? "100%" : isHalf ? "50%" : "0%",
                          }}
                        >
                          ★
                        </span>
                      </span>
                    );
                  })}
                  <span className="ml-2 text-gray-600">
                    {editComment.rating > 0
                      ? `${editComment.rating} stars`
                      : "Select rating"}
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCommentId(null)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </form>
            ) : (
              // Hiển thị feedback
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={comment.userAvatar || "https://i.pravatar.cc/300"}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{comment.fullName}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                  {userId === comment.userId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="commentContent mt-2">
                  <p>
                    {comment.expanded || comment.comment.length <= 100
                      ? comment.comment
                      : `${comment.comment.substring(0, 100)}...`}
                    {comment.comment.length > 100 && (
                      <button
                        onClick={() => toggleFullText(index)}
                        className="text-blue-500 ml-2"
                      >
                        {comment.expanded ? "Collapse" : "Read more"}
                      </button>
                    )}
                  </p>
                </div>
                {comment.imageUrl && (
                  <div className="commentImage mt-2">
                    <img
                      src={comment.imageUrl}
                      alt="Comment image"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="rating mt-2 flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = comment.rate >= star;
                    const isHalf =
                      comment.rate >= star - 0.5 && comment.rate < star;

                    return (
                      <span
                        key={star}
                        className="star relative inline-block text-2xl"
                      >
                        <span className="empty-star text-gray-300">★</span>
                        <span
                          className="filled-star absolute top-0 left-0 text-yellow-400 overflow-hidden"
                          style={{
                            width: isFull ? "100%" : isHalf ? "50%" : "0%",
                          }}
                        >
                          ★
                        </span>
                      </span>
                    );
                  })}
                  <span className="ml-2 text-gray-600">
                    {comment.rate} stars
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
