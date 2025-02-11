package com.example.ECommerce.Project.V1.V1.Repository;

import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlphabetSizeRepository extends JpaRepository<AlphabetSize, Integer> {
}
