package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Service.CloudinaryService.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

   private final CloudinaryService cloudinaryService;
   private static final Logger logger = LoggerFactory.getLogger(CloudinaryController.class);

   @PostMapping("/upload")
   public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
      try {
         logger.info("Received request to upload image");
         String imageUrl = cloudinaryService.uploadImage(file);

         Map<String, String> response = new HashMap<>();
         response.put("imageUrl", imageUrl);

         return ResponseEntity.ok(response);
      } catch (IOException e) {
         logger.error("Error uploading image: {}", e.getMessage(), e);

         Map<String, String> response = new HashMap<>();
         response.put("error", e.getMessage());

         return ResponseEntity.internalServerError().body(response);
      }
   }

   @PostMapping("/upload/post")
   public ResponseEntity<Map<String, String>> uploadPostImage(@RequestParam("file") MultipartFile file) {
      try {
         logger.info("Received request to upload post image");
         String imageUrl = cloudinaryService.uploadPostImage(file);

         Map<String, String> response = new HashMap<>();
         response.put("imageUrl", imageUrl);

         return ResponseEntity.ok(response);
      } catch (IOException e) {
         logger.error("Error uploading post image: {}", e.getMessage(), e);

         Map<String, String> response = new HashMap<>();
         response.put("error", e.getMessage());

         return ResponseEntity.internalServerError().body(response);
      }
   }

   @PostMapping("/upload/avatar")
   public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
      try {
         logger.info("Received request to upload avatar");
         String imageUrl = cloudinaryService.uploadAvatar(file);

         Map<String, String> response = new HashMap<>();
         response.put("imageUrl", imageUrl);

         return ResponseEntity.ok(response);
      } catch (IOException e) {
         logger.error("Error uploading avatar: {}", e.getMessage(), e);

         Map<String, String> response = new HashMap<>();
         response.put("error", e.getMessage());

         return ResponseEntity.internalServerError().body(response);
      }
   }

   @DeleteMapping("/delete")
   public ResponseEntity<Map<String, Boolean>> deleteImage(@RequestParam("publicId") String publicId) {
      logger.info("Received request to delete image with publicId: {}", publicId);
      boolean deleted = cloudinaryService.deleteFile(publicId);

      Map<String, Boolean> response = new HashMap<>();
      response.put("deleted", deleted);

      return ResponseEntity.ok(response);
   }
}