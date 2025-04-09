package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.ProductGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductGalleryRepository extends JpaRepository<ProductGallery, Integer> {

    @Query("SELECT MAX(pg.sortOrder) FROM ProductGallery pg WHERE pg.product.id = :productId")
    Integer findMaxSortOrderByProductId(@Param("productId") Integer productId);

    @Query("SELECT pg FROM ProductGallery pg WHERE pg.product.id = :productId ORDER BY pg.sortOrder ASC")
    List<ProductGallery> getProductGalleriesByProductId(@Param("productId") Integer productId);

    @Query("SELECT pg FROM ProductGallery pg WHERE pg.product.id = :productId ORDER BY pg.sortOrder ASC LIMIT 1")
    ProductGallery getProductGalleryByIdAndMinSortOrder(@Param("productId") Integer productId);
}
