package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.NumericSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NumericSizeRepository extends JpaRepository<NumericSize, UUID> {
    boolean existsByNumericSize(Integer numericSize);
}
