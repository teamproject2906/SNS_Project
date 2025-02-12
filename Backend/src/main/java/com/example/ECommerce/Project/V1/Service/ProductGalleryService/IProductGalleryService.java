package com.example.ECommerce.Project.V1.Service.ProductGalleryService;

import com.example.ECommerce.Project.V1.Model.ProductGallery;

import java.util.List;
import java.util.UUID;

public interface IProductGalleryService {

    ProductGallery addProductGallery(ProductGallery productGallery);
    List<ProductGallery> getAllProductGalleries();
    ProductGallery getProductGalleryById(UUID id);
}
