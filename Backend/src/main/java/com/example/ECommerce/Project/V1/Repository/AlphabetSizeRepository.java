package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlphabetSizeRepository extends JpaRepository<AlphabetSize, Integer> {

    boolean existsAlphabetSizeByAlphabetSize(String alphabetSize);

    @Query("SELECT al FROM AlphabetSize al WHERE al.isActive = true")
    List<AlphabetSize> getActiveAlphabetSize();
}
