package com.example.ECommerce.Project.V1.Config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

   private static final Logger logger = LoggerFactory.getLogger(CloudinaryConfig.class);

   @Value("${cloudinary.cloud-name}")
   private String cloudName;

   @Value("${cloudinary.api-key}")
   private String apiKey;

   @Value("${cloudinary.api-secret}")
   private String apiSecret;

   @Bean
   public Cloudinary cloudinary() {
      logger.info("Initializing Cloudinary with cloud name: {}", cloudName);

      Map<String, String> config = new HashMap<>();
      config.put("cloud_name", cloudName);
      config.put("api_key", apiKey);
      config.put("api_secret", apiSecret);

      logger.info("Cloudinary configuration completed");
      return new Cloudinary(config);
   }
}