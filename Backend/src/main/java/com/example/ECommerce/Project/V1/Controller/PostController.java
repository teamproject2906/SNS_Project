package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.PostDTO;
import com.example.ECommerce.Project.V1.DTO.ResponseDTO.ResponseMessageAPI;
import com.example.ECommerce.Project.V1.Service.CloudinaryService.CloudinaryService;
import com.example.ECommerce.Project.V1.Service.PostService.IPostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/social/api/post")
@RequiredArgsConstructor
public class PostController {

   private final IPostService postService;
   private final CloudinaryService cloudinaryService;
   private static final Logger logger = LoggerFactory.getLogger(PostController.class);

   @GetMapping("/getAllPostActive")
   public ResponseEntity<List<PostDTO>> getAllPostsActive() {
      return ResponseEntity.ok(postService.getAllPostsActive());
   }

   @GetMapping("/getPostsByUid/{userId}")
   public ResponseEntity<List<PostDTO>> getPostsByUid(
           @PathVariable Integer userId) {
      return ResponseEntity.ok(postService.getPostsByUID(userId));
   }

   @PostMapping("/createPost")
   public ResponseEntity<PostDTO> createPost(
         @RequestBody PostDTO postDTO,
         Principal connectedUser) {
      return ResponseEntity.ok(postService.createPost(postDTO, connectedUser));
   }

   /**
    * Tạo bài đăng kèm ảnh
    * 
    * @param file          File ảnh cần upload
    * @param content       Nội dung bài đăng
    * @param connectedUser Thông tin người dùng
    * @return Thông tin bài đăng đã tạo
    */
   @PostMapping(value = "/createPostWithImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<?> createPostWithImage(
         @RequestParam("file") MultipartFile file,
         @RequestParam("content") String content,
         Principal connectedUser) {
      try {
         logger.info("Creating post with image, content: {}", content);

         // 1. Upload ảnh lên Cloudinary
         String imageUrl = cloudinaryService.uploadPostImage(file);
         logger.info("Image uploaded successfully to Cloudinary: {}", imageUrl);

         // 2. Tạo PostDTO với thông tin bài đăng
         PostDTO postDTO = PostDTO.builder()
               .content(content)
               .imageUrl(imageUrl)
               .isActive(true)
               .build();

         // 3. Gọi service để tạo bài đăng
         PostDTO createdPost = postService.createPost(postDTO, connectedUser);

         return ResponseEntity.ok(createdPost);
      } catch (IOException e) {
         logger.error("Error creating post with image: {}", e.getMessage(), e);

         ResponseMessageAPI errorResponse = ResponseMessageAPI.builder()
               .message("Failed to upload image: " + e.getMessage())
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .success(false)
               .build();

         return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @PutMapping("/updatePost/{postId}")
   public ResponseEntity<PostDTO> updatePost(
         @RequestBody PostDTO postDTO,
         @PathVariable UUID postId,
         Principal connectedUser) {
      return ResponseEntity.ok(postService.updatePost(postDTO, postId, connectedUser));
   }

   /**
    * Cập nhật bài đăng kèm ảnh
    * 
    * @param file          File ảnh mới (nếu có)
    * @param content       Nội dung bài đăng
    * @param postId        ID của bài đăng cần cập nhật
    * @param connectedUser Thông tin người dùng
    * @return Thông tin bài đăng đã cập nhật
    */
   @PutMapping(value = "/updatePostWithImage/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<?> updatePostWithImage(
         @RequestParam(value = "file", required = false) MultipartFile file,
         @RequestParam("content") String content,
         @PathVariable UUID postId,
         Principal connectedUser) {
      try {
         logger.info("Updating post with ID: {}", postId);

         // 1. Lấy thông tin bài đăng hiện tại
         PostDTO existingPost = postService.getPostById(postId);
         String imageUrl = existingPost.getImageUrl();

         // 2. Nếu có file ảnh mới, upload và cập nhật URL
         if (file != null && !file.isEmpty()) {
            imageUrl = cloudinaryService.uploadPostImage(file);
            logger.info("New image uploaded for post {}: {}", postId, imageUrl);
         }

         // 3. Cập nhật thông tin bài đăng
         PostDTO postDTO = PostDTO.builder()
               .content(content)
               .imageUrl(imageUrl)
               .build();

         // 4. Gọi service để cập nhật bài đăng
         PostDTO updatedPost = postService.updatePost(postDTO, postId, connectedUser);

         return ResponseEntity.ok(updatedPost);
      } catch (Exception e) {
         logger.error("Error updating post with image: {}", e.getMessage(), e);

         ResponseMessageAPI errorResponse = ResponseMessageAPI.builder()
               .message("Failed to update post: " + e.getMessage())
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .success(false)
               .build();

         return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @PatchMapping("/deactivatePost/{postId}")
   public ResponseEntity<ResponseMessageAPI> deletePost(
         @RequestBody PostDTO postDTO,
         @PathVariable UUID postId,
         Principal connectedUser) {
      postService.deactivatePost(postDTO, postId, connectedUser);
      ResponseMessageAPI responseMessageAPI = ResponseMessageAPI.builder()
            .message("Delete post successfully")
            .status(HttpStatus.OK)
            .success(true)
            .build();
      return new ResponseEntity<>(responseMessageAPI, HttpStatus.OK);
   }

   @GetMapping("/getPostById/{postId}")
   public ResponseEntity<PostDTO> getPostById(
         @PathVariable UUID postId) {
      return ResponseEntity.ok(postService.getPostById(postId));
   }

   @GetMapping("/searchPost/{content}")
   public ResponseEntity<List<PostDTO>> getPostsByTitle(
         @PathVariable String content,
         Principal connectedUser) {
      return ResponseEntity.ok(postService.searchPostByTitle(content, connectedUser));
   }

   @PostMapping("/likePost/{postId}")
   public ResponseEntity<ResponseMessageAPI> likePost(
         @PathVariable UUID postId,
         Principal connectedUser) {
      postService.likeOrDislikePost(postId, connectedUser);
      ResponseMessageAPI responseMessageAPI = ResponseMessageAPI.builder()
            .message("Like/Dislike post successfully")
            .status(HttpStatus.OK)
            .success(true)
            .build();
      return new ResponseEntity<>(responseMessageAPI, HttpStatus.OK);
   }
}
