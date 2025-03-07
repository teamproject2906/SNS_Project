package com.example.ECommerce.Project.V1.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Optional<Product> findProductByProductCode(String productCode);
    List<Product> findProductsByProductNameContainingIgnoreCase(String productName);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.isActive = false WHERE p.id = :id")
    void deActivateProduct(@Param("id") Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.isActive = true WHERE p.id = :id")
    void reActivateProduct(@Param("id") Integer id);
}
