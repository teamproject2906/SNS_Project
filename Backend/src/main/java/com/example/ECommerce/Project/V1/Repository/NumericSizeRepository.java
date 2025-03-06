package com.example.ECommerce.Project.V1.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NumericSizeRepository extends JpaRepository<NumericSize, Integer> {
    boolean existsByNumericSize(Integer numericSize);
}
