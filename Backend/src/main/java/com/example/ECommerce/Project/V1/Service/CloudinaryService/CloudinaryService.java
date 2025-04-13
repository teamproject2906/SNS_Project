package com.example.ECommerce.Project.V1.Service.CloudinaryService;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

   private final Cloudinary cloudinary;
   private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

   /**
    * Upload file lên Cloudinary
    * 
    * @param file   File cần upload
    * @param folder Thư mục lưu trữ trên Cloudinary (ví dụ: "social_posts",
    *               "avatars")
    * @return URL của file đã upload
    * @throws IOException Nếu có lỗi khi upload
    */
   public String uploadFile(MultipartFile file, String folder) throws IOException {
      if (file.isEmpty()) {
         logger.warn("Empty file provided for upload");
         throw new IllegalArgumentException("File cannot be empty");
      }

      logger.info("Uploading file to Cloudinary folder: {}", folder);

      try {
         // Tạo public_id duy nhất cho file
         String publicId = folder + "/" + UUID.randomUUID().toString();

         // Cấu hình upload
         Map<String, Object> params = ObjectUtils.asMap(
               "public_id", publicId,
               "folder", folder,
               "overwrite", true,
               "resource_type", "auto" // Tự động phát hiện loại tài nguyên (image, video, raw)
         );

         // Upload file lên Cloudinary
         Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

         // Lấy URL của file đã upload
         String secureUrl = (String) uploadResult.get("secure_url");
         logger.info("File uploaded successfully to Cloudinary: {}", secureUrl);

         return secureUrl;
      } catch (IOException e) {
         logger.error("Error uploading file to Cloudinary: {}", e.getMessage(), e);
         throw e;
      }
   }

   /**
    * Upload file ảnh lên Cloudinary (shorthand method)
    * 
    * @param file File ảnh cần upload
    * @return URL của ảnh đã upload
    * @throws IOException Nếu có lỗi khi upload
    */
   public String uploadImage(MultipartFile file) throws IOException {
      return uploadFile(file, "images");
   }

   /**
    * Upload ảnh post lên Cloudinary
    * 
    * @param file File ảnh cần upload
    * @return URL của ảnh đã upload
    * @throws IOException Nếu có lỗi khi upload
    */
   public String uploadPostImage(MultipartFile file) throws IOException {
      return uploadFile(file, "social_posts");
   }

   /**
    * Upload ảnh avatar lên Cloudinary
    * 
    * @param file File ảnh cần upload
    * @return URL của ảnh đã upload
    * @throws IOException Nếu có lỗi khi upload
    */
   public String uploadAvatar(MultipartFile file) throws IOException {
      return uploadFile(file, "avatars");
   }

   /**
    * Xóa file trên Cloudinary
    * 
    * @param publicId Public ID của file cần xóa (ví dụ: "social_posts/abc123")
    * @return true nếu xóa thành công, false nếu có lỗi
    */
   public boolean deleteFile(String publicId) {
      try {
         logger.info("Deleting file from Cloudinary: {}", publicId);
         Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

         String status = (String) result.get("result");
         boolean success = "ok".equals(status);

         if (success) {
            logger.info("File deleted successfully from Cloudinary: {}", publicId);
         } else {
            logger.warn("Failed to delete file from Cloudinary: {}, status: {}", publicId, status);
         }

         return success;
      } catch (Exception e) {
         logger.error("Error deleting file from Cloudinary: {}", e.getMessage(), e);
         return false;
      }
   }
}