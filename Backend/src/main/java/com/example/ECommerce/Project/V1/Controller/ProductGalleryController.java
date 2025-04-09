package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Exception.ImageLimitExceededException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.ProductGallery;
import com.example.ECommerce.Project.V1.Service.ProductGalleryService.IProductGalleryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/product-gallery")
public class ProductGalleryController {
    private final IProductGalleryService productGalleryService;

    public ProductGalleryController(IProductGalleryService productGalleryService) {
        this.productGalleryService = productGalleryService;
    }

    @GetMapping("")
    public ResponseEntity<List<ProductGallery>> getAllProductGallery() {
        return ResponseEntity.ok(productGalleryService.getAllProductGallery());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductGallery>> getImagesByProductId(@PathVariable("productId") Integer productId) {
        List<ProductGallery> images = productGalleryService.getAllProductGalleryByProductId(productId);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<ProductGallery> getProductGalleryById(@PathVariable("imageId") Integer imageId) {
        ProductGallery productGallery = productGalleryService.getProductGalleryById(imageId);
        return ResponseEntity.ok(productGallery);
    }

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadImage(
            @RequestParam("productId") Integer productId,
            @RequestParam("file") MultipartFile file) {

        try {
            long currentImageCount = productGalleryService.getImageCountForProduct(productId);

            if (currentImageCount >= 10) {
                throw new ImageLimitExceededException("Maximum limit of 10 images per product reached");
            }
            ProductGallery savedGallery = productGalleryService.uploadImage(productId, file);
            return ResponseEntity.ok(savedGallery);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(null);
        } catch (ImageLimitExceededException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<Object> uploadMultipleImages(
            @RequestParam("productId") Integer productId,
            @RequestParam("files") List<MultipartFile> files


    ) {
        List<ProductGallery> uploadImages = new ArrayList<>();

        try {
            long currentImageCount = productGalleryService.getImageCountForProduct(productId);

            if (currentImageCount >= 10) {
                throw new ImageLimitExceededException("Maximum limit of 10 images per product reached");
            }

            for (MultipartFile file : files) {
                ProductGallery savedGallery = productGalleryService.uploadImage(productId, file);
                uploadImages.add(savedGallery);
            }

            return ResponseEntity.ok(uploadImages);
        } catch (ImageLimitExceededException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PatchMapping("/update/{productId}")
    public ResponseEntity<String> updateProductGallery(@PathVariable("productId") Integer productId, @RequestParam("files") MultipartFile[] files) {
        try {
            productGalleryService.updateProductGallery(productId, files);
            return ResponseEntity.ok("Product gallery updated successfully for product ID: " + productId);

        } catch (ResourceNotFoundException e) {
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating product gallery: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{productGalleryId}")
    public ResponseEntity<String> deleteProductGalleryImageById(@PathVariable("productGalleryId") Integer productGalleryId) {
        productGalleryService.deleteProductGalleryById(productGalleryId);
        return ResponseEntity.ok("Deleted product gallery");
    }

    @DeleteMapping("/product/delete/{productId}")
    public ResponseEntity<String> deleteProductGalleryByProductId(@PathVariable("productId") Integer productId) {
        productGalleryService.deleteProductGalleryByProductId(productId);
        return ResponseEntity.ok("All product gallery with product id " + productId + " deleted");
    }
}
