export const getTimeAgo = (date) => {
  const now = Date.now();
  const timestamp = new Date(date).getTime();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 6) {
    return `${days} days ago`;
  } else {
    return `${new Date(timestamp).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}`;
  }
};
