package com.example.ECommerce.Project.V1.Service.CategoryService;

import com.example.ECommerce.Project.V1.Model.Category;
import com.example.ECommerce.Project.V1.Repository.CategoryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository repository;
    private final EntityManager entityManager;

    public CategoryServiceImpl(CategoryRepository repository, EntityManager entityManager) {
        this.repository = repository;
        this.entityManager = entityManager;
    }


    @Override
    public Category createCategory(Category categoryRequest) {

        // Fetch parent category if parentCategoryID is provided
        Category parentCategory = null;
        if(categoryRequest.getParentCategoryID() != null) {
            parentCategory = repository.findById(categoryRequest.getParentCategoryID().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent Category Not Found"));
        }

        if (parentCategory != null && parentCategory.getCategoryName().equals(categoryRequest.getCategoryName())) {
            throw new IllegalArgumentException("Category Name Already Exists");
        }

        if(categoryRequest.getCategoryName().isBlank()) {
            throw new IllegalArgumentException("Category Name Cannot Be Empty");
        }

        // Create the new category
        Category category = Category.builder()
                .categoryName(categoryRequest.getCategoryName())
                .parentCategoryID(parentCategory)
                .build();

        Category savedCategory = repository.save(category);

        return savedCategory;
    }

    @Override
    public List<Category> getAllCategories() {
        List<Category> categories = repository.findAll();
        return categories;
    }

    @Override
    public Category getCategoryById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
    }

    @Override
    public List<Category> getAllCategoriesOfParentById(UUID parentCategoryId) {
        List<Category> childCategories = repository.findByParentCategoryID(parentCategoryId);
        return childCategories;
    }

    @Override
    public List<Category> getAllCategoriesByName(String categoryName) {
        return repository.findByCategoryNameContainingIgnoreCase(categoryName);
    }

    private boolean isParentCategoryidExist(UUID parentCategoryID) {
        return repository.findById(parentCategoryID).isPresent();
    }


    @Override
    public Category updateCategoryById(UUID id, Category category) {
        Category updatingCategory = getCategoryById(id);

        if (updatingCategory != null) {

            if (category.getCategoryName() != null) {
                if(category.getCategoryName().isBlank()) {
                    throw new RuntimeException("Category Name Cannot Be Empty");
                }
                updatingCategory.setCategoryName(category.getCategoryName());
            }

            if (category.getParentCategoryID() != null) {
                if(isParentCategoryidExist(category.getParentCategoryID().getId())) {
                    updatingCategory.setParentCategoryID(category.getParentCategoryID());
                } else {
                    throw new RuntimeException("Parent Category ID Not Found");
                }
            }

            repository.save(updatingCategory);
        }

        return updatingCategory;
    }

    @Override
    public void deleteCategoryById(UUID id) {
        Category category = getCategoryById(id);
        repository.deActiveCategory(id);
    }

    @Override
    @Transactional
    public Category reActiveCategoryById(UUID id) {
        Category category = getCategoryById(id);

        if (category != null) {
            repository.reactiveCategory(id);
            entityManager.refresh(category);
        }

         return category;
    }

    @Override
    public void deleteAllCategories() {
        repository.deleteAll();
    }


}
