/**
 * Convert flat comment list to tree with `replies` field
 * @param {Array} comments
 * @returns {Array}
 */
export const buildCommentTree = (comments) => {
  const map = new Map();
  const roots = [];

  // Bước 1: Khởi tạo map và thêm trường `replies` cho mỗi comment
  comments.forEach((comment) => {
    comment.replies = [];
    map.set(comment.id, comment);
  });

  // Bước 2: Gắn replies vào comment cha nếu hợp lệ
  comments.forEach((comment) => {
    const parentId = comment.commentReplyId;
    // Chỉ gắn nếu: có parentId, khác id chính nó, và parent tồn tại
    if (parentId !== null && parentId !== comment.id && map.has(parentId)) {
      const parent = map.get(parentId);
      parent.replies.push(comment);
    } else {
      roots.push(comment); // Comment gốc
    }
  });

  return roots;
};
