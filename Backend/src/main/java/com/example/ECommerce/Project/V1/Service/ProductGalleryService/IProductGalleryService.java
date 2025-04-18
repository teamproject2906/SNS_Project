package com.example.ECommerce.Project.V1.Service.ProductGalleryService;

import com.example.ECommerce.Project.V1.Model.ProductGallery;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface IProductGalleryService {

    ProductGallery uploadImage(Integer productId, MultipartFile file) throws IOException;
    List<ProductGallery> uploadMultipleImages(Integer productId, MultipartFile[] files, Boolean isThumbnail, Integer sortOrder) throws IOException;
    List<ProductGallery> getAllProductGallery();
    List<ProductGallery> getAllProductGalleryByProductId(Integer productId);
    ProductGallery getProductGalleryById(Integer id);

    String getProductGalleryByIdAndMinSortOrder(Integer id);

    void updateProductGallery(Integer productId, MultipartFile[] files) throws IOException;
    void deleteProductGalleryById(Integer imageId);
    void deleteProductGalleryByProductId(Integer productId);
    long getImageCountForProduct(Integer productId);

    List<ProductGallery> getImageByProductCode(String productCode);
}
