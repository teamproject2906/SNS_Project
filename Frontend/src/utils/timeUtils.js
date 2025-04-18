export const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes === 0 ? 1 : minutes} phút trước`;
};
