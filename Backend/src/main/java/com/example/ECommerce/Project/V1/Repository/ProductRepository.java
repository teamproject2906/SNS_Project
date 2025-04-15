package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.DTO.ProductResponseDTO;
import com.example.ECommerce.Project.V1.Model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findProductByProductCode(String productCode);
    List<Product> findProductsByProductNameContainingIgnoreCase(String productName);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.isActive = false WHERE p.id = :id")
    void deActivateProduct(@Param("id") Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.isActive = true WHERE p.id = :id")
    void reActivateProduct(@Param("id") Integer id);

    // Supports pagination & sorting
    Page<Product> findAll(Pageable pageable);

    @Query("select p from Product p WHERE p.productCode = :productCode order by p.id asc limit 1")
    Optional<Product> findSpecificProductByProductCode(@Param("productCode") String productCode);

    @Query("SELECT DISTINCT p.productCode FROM Product p")
    List<String> getAllProductCodes();
}
