package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AlphabetSizeRepository extends JpaRepository<AlphabetSize, UUID> {

    boolean existsAlphabetSizeByAlphabetSize(String alphabetSize);
}
