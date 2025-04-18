/**
 * Convert flat comment list to tree with `replies` field
 * @param {Array} comments
 * @returns {Array}
 */
export const buildCommentTree = (comments) => {
  const map = new Map();
  const roots = [];

  comments.forEach((comment) => {
    comment.replies = [];

    // Normalize nếu comment tự trả lời chính nó
    if (comment.commentReplyId === comment.id) {
      comment.commentReplyId = null;
    }

    map.set(comment.id, comment);
  });

  comments.forEach((comment) => {
    const parentId = comment.commentReplyId;

    if (parentId !== null && map.has(parentId)) {
      const parent = map.get(parentId);
      parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};
