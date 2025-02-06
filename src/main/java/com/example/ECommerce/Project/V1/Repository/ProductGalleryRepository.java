package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.ProductGallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductGalleryRepository extends JpaRepository<ProductGallery, UUID> {
}
