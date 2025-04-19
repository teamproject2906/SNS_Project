import axios from "axios";
import { getToken } from "../pages/Login/app/static";

const API_URL = "http://localhost:8080";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const organizeCommentsHierarchy = (comments) => {
  if (!comments || !Array.isArray(comments) || comments.length === 0) {
    return [];
  }

  const sortedComments = [...comments].sort((a, b) => {
    // Sắp xếp theo ID (giả định ID mới sẽ lớn hơn) nếu không có createdAt
    const idA = parseInt(a.id || a.commentReplyId || 0);
    const idB = parseInt(b.id || b.commentReplyId || 0);

    if (!a.createdAt || !b.createdAt) return idA - idB;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Khởi tạo cấu trúc dữ liệu
  const commentMap = {}; // Map ID -> comment
  const rootComments = []; // Mảng các comment gốc
  const processedIds = new Set(); // Các ID đã được xử lý

  // Bước 1: Đăng ký tất cả comment vào map và xác định các comment chắc chắn là gốc
  sortedComments.forEach((comment) => {
    if (!comment) return;

    // Lấy ID chính xác
    const commentId = comment.id || comment.commentReplyId;
    if (!commentId) return;

    // Chuẩn bị comment object với các trường cần thiết
    commentMap[commentId] = {
      ...comment,
      id: commentId, // Đảm bảo ID nhất quán
      replies: [],
      level: 0,
      content: comment.content || "",
    };
  });

  // Bước 2: Phân tích từng comment để xác định mối quan hệ phân cấp
  sortedComments.forEach((comment) => {
    if (!comment) return;

    // Lấy ID chính xác
    const commentId = comment.id || comment.commentReplyId;
    if (!commentId || processedIds.has(commentId)) return;

    // Kiểm tra nếu nội dung bắt đầu bằng @username -> có thể là reply
    const content = comment.content || "";
    const match = content.match(/^@(\S+)/);

    if (match && match[1]) {
      // Đây có thể là một reply
      const mentionedUsername = match[1];

      // Tìm comment gốc có username trùng khớp
      let parentFound = false;

      // Lặp qua tất cả các comment để tìm parent phù hợp
      for (const potentialParentId in commentMap) {
        const potentialParent = commentMap[potentialParentId];

        // So sánh username
        if (
          potentialParent.user &&
          potentialParent.user.toLowerCase() ===
            mentionedUsername.toLowerCase() &&
          potentialParentId !== commentId
        ) {
          // Không phải là chính nó

          // Tìm thấy parent
          parentFound = true;

          // Thiết lập level và thông tin reply
          commentMap[commentId].level = potentialParent.level + 1;
          commentMap[commentId].replyingTo = potentialParent.user;

          // Thêm vào mảng replies của parent
          potentialParent.replies.push(commentMap[commentId]);

          // Đánh dấu đã xử lý
          processedIds.add(commentId);
          break;
        }
      }

      // Nếu không tìm thấy parent, coi là comment gốc
      if (!parentFound && !processedIds.has(commentId)) {
        rootComments.push(commentMap[commentId]);
        processedIds.add(commentId);
      }
    } else if (!processedIds.has(commentId)) {
      // Đây là một comment gốc
      rootComments.push(commentMap[commentId]);
      processedIds.add(commentId);
    }
  });

  return rootComments;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryRequest = async (requestFn, retries = MAX_RETRIES) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(requestFn, retries - 1);
    }
    throw error;
  }
};

const updateComment = async (commentId, body) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/social/api/comment/updateComment/${commentId}`, body)
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

const deleteComment = async (commentId, body) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/social/api/comment/deleteComment/${commentId}`, body)
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Update existing functions to use retry logic
const createComment = async (body) => {
  try {
    const response = await retryRequest(() =>
      api.post("/social/api/comment/addComment", body)
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

const getCommentsByPostId = async (postId) => {
  try {
    const response = await retryRequest(() =>
      api.get(`/social/api/comment/getCommentsByPostId/${postId.toString()}`, {
        params: {
          debug: true,
        },
      })
    );
    return organizeCommentsHierarchy(response.data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const commentService = {
  // Create a new comment
  createComment: createComment,

  // Get all comments for a post
  getCommentsByPostId: getCommentsByPostId,

  // Update a comment
  updateComment: updateComment,

  // Delete a comment
  deleteComment: deleteComment,

  // Get all comments for a post regardless of active status
  getAllCommentsByPostId: async (postId) => {
    try {
      // Ensure postId is in the correct format
      const formattedPostId = postId.toString();

      const response = await api.get(
        `/social/api/comment/getAllCommentsByPostId/${formattedPostId}`,
        {
          params: {
            debug: true,
          },
        }
      );

      // Check if response.data is valid
      if (!response.data) {
        return [];
      }

      // Ensure response.data is an array
      let commentsArray = [];
      if (Array.isArray(response.data)) {
        commentsArray = response.data;
      } else if (typeof response.data === "object") {
        commentsArray = [response.data];
      } else {
        return [];
      }

      // Process each comment to ensure necessary fields
      const processedComments = commentsArray.map((comment) => {
        // Make sure content is a string
        if (comment.content === null || comment.content === undefined) {
          comment.content = "";
        }

        // Ensure we have a valid ID
        if (!comment.id && comment.commentReplyId) {
          comment.id = comment.commentReplyId;
        }

        return comment;
      });

      // Sắp xếp bình luận thành cấu trúc phân cấp
      const organizedComments = organizeCommentsHierarchy(processedComments);

      return organizedComments;
    } catch (error) {
      console.error("Error fetching ALL comments:", error);
      throw error;
    }
  },
};
