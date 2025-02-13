package com.example.ECommerce.Project.V1.Service.CategoryService;

import com.example.ECommerce.Project.V1.Model.Category;

import java.util.List;
import java.util.UUID;


public interface ICategoryService {

    Category createCategory(Category category);
    List<Category> getAllCategories();
    Category getCategoryById(Integer id);
    List<Category> getAllCategoriesOfParentById(Integer parentCategoryId);
    List<Category> getAllCategoriesByName(String categoryName);
    Category updateCategoryById(Integer id, Category category);
    void deleteCategoryById(Integer id);
    Category reActiveCategoryById(Integer id);
    void deleteAllCategories();

}
