package com.example.ECommerce.Project.V1.Service.ProductGalleryService;

import com.example.ECommerce.Project.V1.Model.ProductGallery;
import com.example.ECommerce.Project.V1.Repository.ProductGalleryRepository;
import com.example.ECommerce.Project.V1.Service.ProductGalleryService.IProductGalleryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductGalleryServiceImpl implements IProductGalleryService {
    private final ProductGalleryRepository productGalleryRepository;

    public ProductGalleryServiceImpl(ProductGalleryRepository productGalleryRepository) {
        this.productGalleryRepository = productGalleryRepository;
    }

    @Override
    public ProductGallery addProductGallery(ProductGallery productGallery) {
        return productGalleryRepository.save(productGallery);
    }

    @Override
    public List<ProductGallery> getAllProductGalleries() {
        return productGalleryRepository.findAll();
    }

    @Override
    public ProductGallery getProductGalleryById(UUID id) {
        return null;
    }
}
