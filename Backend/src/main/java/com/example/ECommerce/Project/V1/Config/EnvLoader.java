package com.example.ECommerce.Project.V1.Config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class EnvLoader {

   private static final Logger logger = LoggerFactory.getLogger(EnvLoader.class);

   @PostConstruct
   public void init() {
      try {
         logger.info("Loading environment variables from .env file");

         Dotenv dotenv = Dotenv.configure()
               .directory("./") // Thư mục gốc của dự án (Backend)
               .ignoreIfMissing() // Không báo lỗi nếu file .env không tồn tại
               .load();

         // Cloudinary variables
         setEnvIfPresent(dotenv, "CLOUDINARY_NAME", "cloudinary.cloud-name");
         setEnvIfPresent(dotenv, "CLOUDINARY_API_KEY", "cloudinary.api-key");
         setEnvIfPresent(dotenv, "CLOUDINARY_API_SECRET", "cloudinary.api-secret");

         logger.info("Environment variables loaded successfully");
      } catch (Exception e) {
         logger.error("Error loading .env file: {}", e.getMessage(), e);
      }
   }

   private void setEnvIfPresent(Dotenv dotenv, String envKey, String systemProperty) {
      String value = dotenv.get(envKey);
      if (value != null && !value.isEmpty()) {
         logger.debug("Setting system property '{}' from environment variable", systemProperty);
         System.setProperty(systemProperty, value);
      } else {
         logger.debug("Environment variable '{}' not found in .env file", envKey);
      }
   }
}