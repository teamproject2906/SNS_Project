package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Model.ProductGallery;
import com.example.ECommerce.Project.V1.Service.ProductGalleryService.IProductGalleryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productsgallery")
public class ProductGalleryController {
    private final IProductGalleryService productGalleryService;

    public ProductGalleryController(IProductGalleryService productGalleryService) {
        this.productGalleryService = productGalleryService;
    }

    @PostMapping()
    public ResponseEntity<ProductGallery> createProductGallery(@Valid @RequestBody ProductGallery productGallery) {
        return new ResponseEntity<>(productGalleryService.addProductGallery(productGallery), HttpStatus.CREATED);
    }

    @GetMapping()
    public List<ProductGallery> getAllProductGallery() {
        return productGalleryService.getAllProductGalleries();
    }
}
