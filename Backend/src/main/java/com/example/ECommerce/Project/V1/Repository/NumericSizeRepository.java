package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.NumericSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NumericSizeRepository extends JpaRepository<NumericSize, Integer> {
    boolean existsByNumericSize(Integer numericSize);
}
