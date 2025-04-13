# SNS_Project

# Backend Service

## Cấu hình Cloudinary

Dự án sử dụng Cloudinary để lưu trữ và quản lý ảnh. Để cấu hình Cloudinary trên môi trường phát triển local:

1. Tạo file `.env` trong thư mục `Backend` với nội dung sau:

```
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

2. Thay thế các giá trị `your_cloudinary_name`, `your_cloudinary_api_key`, và `your_cloudinary_api_secret` bằng thông tin Cloudinary của bạn. Bạn có thể lấy thông tin này từ trang Dashboard của Cloudinary.

## API Endpoints cho Upload ảnh

### Upload ảnh thông thường

```
POST /api/cloudinary/upload
```

Multipart form data:

-  `file`: File ảnh cần upload

### Upload ảnh cho bài đăng

```
POST /api/cloudinary/upload/post
```

Multipart form data:

-  `file`: File ảnh cần upload

### Upload ảnh avatar

```
POST /api/cloudinary/upload/avatar
```

Multipart form data:

-  `file`: File ảnh cần upload

### Tạo bài đăng kèm ảnh

```
POST /social/api/post/createPostWithImage
```

Multipart form data:

-  `file`: File ảnh cần upload
-  `content`: Nội dung bài đăng

### Cập nhật bài đăng kèm ảnh

```
PUT /social/api/post/updatePostWithImage/{postId}
```

Multipart form data:

-  `file`: File ảnh mới (không bắt buộc)
-  `content`: Nội dung bài đăng mới

## Sử dụng Cloudinary trong Frontend

Để sử dụng các API upload ảnh từ frontend:

```javascript
// Ví dụ upload ảnh và tạo bài đăng
const createPostWithImage = async (content, imageFile) => {
	try {
		const formData = new FormData();
		formData.append("file", imageFile);
		formData.append("content", content);

		const response = await axios.post(
			"http://localhost:8080/social/api/post/createPostWithImage",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error creating post with image:", error);
		throw error;
	}
};
```
