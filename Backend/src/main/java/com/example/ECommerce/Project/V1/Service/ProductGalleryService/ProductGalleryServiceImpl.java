package com.example.ECommerce.Project.V1.Service.ProductGalleryService;

import com.cloudinary.Cloudinary;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Product;
import com.example.ECommerce.Project.V1.Model.ProductGallery;
import com.example.ECommerce.Project.V1.Repository.ProductGalleryRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class ProductGalleryServiceImpl implements IProductGalleryService {

    private final Cloudinary cloudinary;
    private final ProductRepository productRepository;
    private final ProductGalleryRepository productGalleryRepository;

    public ProductGalleryServiceImpl(Cloudinary cloudinary, ProductRepository productRepository, ProductGalleryRepository productGalleryRepository) {
        this.cloudinary = cloudinary;
        this.productRepository = productRepository;
        this.productGalleryRepository = productGalleryRepository;
    }


    @Override
    public ProductGallery uploadImage(Integer productId, MultipartFile file) throws IOException {
        // Set Cloundinary upload options
        Map<String, Object> options = new HashMap<>();
        options.put("folder", "product_gallery");
        options.put("tags", List.of("product-images"));

        // Upload image to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

        // Get the URL of the uploaded image
        String imageUrl = uploadResult.get("secure_url").toString();

        // Find the product by ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with the ID: " + productId + " not found"));

        // Get the max sortOrder for the given product
        Integer maxSortOrder = productGalleryRepository.findMaxSortOrderByProductId(productId);
        int newSortOrder = (maxSortOrder != null) ? maxSortOrder + 1 : 1;

        ProductGallery productGallery = ProductGallery.builder()
                .product(product)
                .imageUrl(imageUrl)
                .isThumbnail(true)
                .sortOrder(newSortOrder)
                .build();

        return productGalleryRepository.save(productGallery);
    }

    @Override
    public List<ProductGallery> uploadMultipleImages(Integer productId, MultipartFile[] files, Boolean isThumbnail, Integer sortOrder) throws IOException {
        List<String> uploadImageUrls = new ArrayList<>();

        Map<String, Object> options = new HashMap<>();
        options.put("folder", "product_gallery");
        options.put("tags", List.of("my-app"));

        for (MultipartFile file : files) {
            if(!file.isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
                uploadImageUrls.add(uploadResult.get("secure_url").toString());
            }
        }

        return List.of();
    }

    @Override
    public List<ProductGallery> getAllProductGallery() {
        return productGalleryRepository.findAll();
    }

    @Override
    public List<ProductGallery> getAllProductGalleryByProductId(Integer productId) {
        productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product with the ID: " + productId + " not found"));

        return productGalleryRepository.getProductGalleriesByProductId(productId);
    }

    @Override
    public ProductGallery getProductGalleryById(Integer id) {
        return productGalleryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product Gallery with the ID: " + id + " not found"));
    }

    @Override
    public void updateProductGallery(Integer productId, MultipartFile[] files) throws IOException {
         productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with the ID: " + productId + " not found"));

        // Find all product gallery images for the given productId
        List<ProductGallery> existingGalleries = productGalleryRepository.getProductGalleriesByProductId(productId);

        if(existingGalleries.isEmpty()) {
            System.out.println("catch");
            System.out.println(existingGalleries);
            throw new ResourceNotFoundException("Product Gallery with the productID: " + productId + " not found");
        }

        // Delete the existing images from Cloudinary & Database
        for (ProductGallery gallery: existingGalleries) {
            try {
                // Extract public_id from Cloudinary URL
                String publicId = extractPublicId(gallery.getImageUrl());

                cloudinary.uploader().destroy(publicId, Collections.singletonMap("invalidate", true));

            } catch (Exception e) {
                throw new RuntimeException("Error deleting image: " + e.getMessage());
            }
        }

        // Remove existing records from the database
        productGalleryRepository.deleteAll(existingGalleries);
        System.out.println("Existing images deleted for product ID: " + productId);

        Product product = productRepository.findById(productId)
                  .orElseThrow(() -> new ResourceNotFoundException("Product with the ID: " + productId + " not found"));

       int sortOrder = 1;
        Map<String, Object> options = new HashMap<>();
        options.put("folder", "product_gallery");
        options.put("tags", List.of("my-app"));

       for (MultipartFile file : files) {
           if (!file.isEmpty()) {
               Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
               String imageUrl = uploadResult.get("secure_url").toString();

               ProductGallery newProductGallery =ProductGallery.builder()
                       .product(product)
                       .imageUrl(imageUrl)
                       .isThumbnail(true)
                       .sortOrder(sortOrder++)
                       .build();

               productGalleryRepository.save(newProductGallery);
           }

           System.out.println("New images uploaded successfully for product ID: " + productId);
       }
    }

    @Override
    public void deleteProductGalleryById(Integer imageId) {
        // Find the product gallery record
        ProductGallery productGallery = productGalleryRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image with ID " + imageId + " not found"));

        String imageUrl = productGallery.getImageUrl();

        try {
            // Extract public_id from Cloudinary URL
            String publicId = extractPublicId(imageUrl);
            System.out.println("Deleting image with publicId: " + publicId);

            // Delete image from Cloudinary
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, Collections.singletonMap("invalidate", true));

            System.out.println("Cloudinary delete result: " + result);

            // Step 4: If Cloudinary says "not found", ignore and proceed
            if ("not found".equals(result.get("result"))) {
                System.out.println("Image not found in Cloudinary. Proceeding with database deletion.");
            } else if (!"ok".equals(result.get("result"))) {
                System.out.println(result.get("result"));
                throw new RuntimeException("Failed to delete image from Cloudinary: " + result);
            }

            // Delete record from database
            productGalleryRepository.deleteById(imageId);
            System.out.println("Image deleted from database successfully.");

        } catch (Exception e) {
            throw new RuntimeException("Error deleting image: " + e.getMessage());
        }
    }

    @Override
    public void deleteProductGalleryByProductId(Integer productId) {
        // Find all images for the given productId
        List<ProductGallery> productGalleryList = getAllProductGalleryByProductId(productId);

        if(productGalleryList.isEmpty()) {
            throw new ResourceNotFoundException("No images found for the product with ID: " + productId);
        }

        for (ProductGallery productGallery : productGalleryList) {
            String imageUrl = productGallery.getImageUrl();

            try {
                // Extract public_id from Cloudinary URL
                String publicId = extractPublicId(imageUrl);

                // Delete image from Cloudinary
                Map<String, Object> result = cloudinary.uploader().destroy(publicId, Collections.singletonMap("invalidate", true));

                // If Cloudinary says "not found", ignore and proceed
                if ("not found".equals(result.get("result"))) {
                    System.out.println("Image not found in Cloudinary. Proceeding with database deletion.");
                } else if (!"ok".equals(result.get("result")) && !"not found".equals(result.get("result"))) {
                    throw new RuntimeException("Failed to delete image from Cloudinary: " + result);
                }

            } catch (Exception e) {
                throw new RuntimeException("Error deleting image: " + e.getMessage());
            }

            productGalleryRepository.deleteAll(productGalleryList);
            System.out.println("All images for product ID " + productId + " deleted from database.");
        }
    }


    private String extractPublicId(String imageUrl) {
        // Step 1: Remove Cloudinary domain and extract the filename
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1); // Get filename from URL

        // Step 2: Remove file extension if present (Cloudinary public_id does not include extensions)
        String publicId = fileName.contains(".") ? fileName.substring(0, fileName.lastIndexOf(".")) : fileName;

        // Step 3: Prepend folder name if images are stored in "product_gallery/"
        return "product_gallery/" + publicId;
    }

}
