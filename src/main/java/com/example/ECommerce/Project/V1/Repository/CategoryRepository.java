package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Category;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    @Query("SELECT c from Category c WHERE c.parentCategoryID.id = :parentCategoryID")
    List<Category> findByParentCategoryID(@Param("parentCategoryID") UUID parentCategoryID);

    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);

    @Modifying
    @Transactional
    @Query("UPDATE Category c SET c.isActive = false WHERE c.id = :id")
    void deActiveCategory(@Param("id") UUID id);

    @Modifying
    @Transactional
    @Query("UPDATE Category c SET c.isActive = true WHERE c.id = :id")
    void reactiveCategory(@Param("id") UUID id);
}
