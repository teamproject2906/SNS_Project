package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AlphabetSizeRepository extends JpaRepository<AlphabetSize, UUID> {

    boolean existsAlphabetSizeByAlphabetSize(String alphabetSize);
}
