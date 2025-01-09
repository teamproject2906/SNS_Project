package com.example.ECommerce.Project.V1.Service.CategoryService;

import com.example.ECommerce.Project.V1.Model.Category;

import java.util.List;
import java.util.UUID;


public interface ICategoryService {

    Category createCategory(Category category);
    List<Category> getAllCategories();
    Category getCategoryById(UUID id);
    List<Category> getAllCategoriesOfParentById(UUID parentCategoryId);
    List<Category> getAllCategoriesByName(String categoryName);
    Category updateCategoryById(UUID id, Category category);
    void deleteCategoryById(UUID id);
    Category reActiveCategoryById(UUID id);
    void deleteAllCategories();

}
