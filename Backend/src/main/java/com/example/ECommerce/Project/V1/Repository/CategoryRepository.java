package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Category;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT c from Category c WHERE c.parentCategoryID.id = :parentCategoryID")
    List<Category> findByParentCategoryID(@Param("parentCategoryID") Integer parentCategoryID);


    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);
    List<Category> findByIsActiveAndCategoryNameContainingIgnoreCase(Boolean isActive, String categoryName);

    @Modifying
    @Transactional
    @Query("UPDATE Category c SET c.isActive = false WHERE c.id = :id")
    void deActiveCategory(@Param("id") Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE Category c SET c.isActive = true WHERE c.id = :id")
    void reActiveCategory(@Param("id") Integer id);

    boolean existsByCategoryName(String categoryName);
    boolean existsByCategoryNameAndParentCategoryID(String categoryName, Category parentCategory);

    @Query("SELECT c FROM Category c WHERE c.isActive = true")
    List<Category> getActiveCategories();

    @Modifying
    @Transactional
    @Query("UPDATE Category c SET c.isActive = false WHERE c.parentCategoryID.id = :parentCategory")
    void deactivateChildCategories(@Param("parentCategory") Integer parentCategory);

    @Query("SELECT c.id FROM Category c WHERE c.parentCategoryID.id = :parentCategoryID")
    List<Integer> getListIDOfChildCategoriesByParentCategoryID(@Param("parentCategoryID") Integer parentCategoryID);
}
