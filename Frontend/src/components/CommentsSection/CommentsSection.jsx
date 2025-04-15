import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa"; // Sử dụng FontAwesome icons

const CommentsSection = () => {
	const [comments, setComments] = useState([
		{
			userAvatar: "https://i.pravatar.cc/300?img=1",
			userName: "Nguyễn Văn A",
			date: "2025-02-25",
			content:
				"Sản phẩm rất tốt, giao hàng nhanh chóng! Sản phẩm rất tốt, giao hàng nhanh chóng! Sản phẩm rất tốt, giao hàng nhanh chóng!",
			rating: 5,
			likes: 12,
			liked: false,
			expanded: false,
		},
		{
			userAvatar: "https://i.pravatar.cc/300?img=2",
			userName: "Trần Thị B",
			date: "2025-02-24",
			content: "Màu sắc sản phẩm đẹp, đúng như mô tả.",
			rating: 4,
			likes: 5,
			liked: false,
			expanded: false,
		},
	]);

	const toggleFullText = (index) => {
		setComments(
			comments.map((comment, i) => {
				if (i === index) {
					return { ...comment, expanded: !comment.expanded };
				}
				return comment;
			})
		);
	};

	const toggleLike = (index) => {
		setComments(
			comments.map((comment, i) => {
				if (i === index) {
					return {
						...comment,
						likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
						liked: !comment.liked,
					};
				}
				return comment;
			})
		);
	};

	return (
		<div className="commentsSection mt-5 bg-white shadow-md rounded-lg p-4">
			<h3 className="text-2xl font-semibold">Bình luận</h3>
			<div className="commentsList mt-3">
				{comments.map((comment, index) => (
					<div key={index} className="commentItem border-t pt-4 mt-4">
						<div className="flex items-center gap-3">
							<img
								src={comment.userAvatar}
								alt="User avatar"
								className="w-10 h-10 rounded-full"
							/>
							<div className="flex-grow">
								<p className="font-semibold">{comment.userName}</p>
								<p className="text-sm text-gray-500">{comment.date}</p>
							</div>
						</div>
						<div className="commentContent mt-2">
							<p>
								{comment.expanded || comment.content.length <= 100
									? comment.content
									: `${comment.content.substring(0, 100)}...`}
								{comment.content.length > 100 && (
									<button
										onClick={() => toggleFullText(index)}
										className="text-blue-500 ml-2"
									>
										{comment.expanded ? "Thu gọn" : "Xem thêm"}
									</button>
								)}
							</p>
						</div>
						<div className="rating mt-2">
							{"★".repeat(comment.rating)}
							{"☆".repeat(5 - comment.rating)}
						</div>
						<div className="flex items-center justify-between mt-2">
							<button
								className={`text-sm flex items-center gap-1 ${
									comment.liked ? "text-red-500" : "text-gray-500"
								} hover:text-red-700`}
								onClick={() => toggleLike(index)}
							>
								<FaThumbsUp /> Thích ({comment.likes})
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CommentsSection;
