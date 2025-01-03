package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findProductByProductCode(String productCode);
}
