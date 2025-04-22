package com.example.ECommerce.Project.V1.Service.CategoryService;

import com.example.ECommerce.Project.V1.DTO.CategoryResponseDTO;
import com.example.ECommerce.Project.V1.DTO.ParentCategoryResponseDTO;
import com.example.ECommerce.Project.V1.Exception.DuplicateResourceException;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.Category;
import com.example.ECommerce.Project.V1.Repository.CategoryRepository;
import com.example.ECommerce.Project.V1.Repository.ProductRepository;
import com.example.ECommerce.Project.V1.Service.CategoryService.ICategoryService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }


    // Validate function of category name
    private String validateCategoryName(Category categoryRequest) {
        // Validate category name
        if(categoryRequest.getCategoryName() == null || categoryRequest.getCategoryName().isBlank()) {
            throw new InvalidInputException("Category Name Cannot Be Null Or Empty");
        }

        String categoryName = categoryRequest.getCategoryName().trim();

        if (categoryName.length() > 100) {
            throw new InvalidInputException("Category Name Cannot Exceed 100 Characters");
        }

        if (!categoryName.matches("^[a-zA-Z0-9 '_-]+$")) {
            throw new InvalidInputException("Category Name Cannot Contain Special Characters");
        }

        boolean exists = categoryRepository.existsByCategoryName(categoryName);
        System.out.println("Checking if category name exists: " + categoryName + " -> " + exists);

        // Global uniqueness check for categories without parent
        if (categoryRepository.existsByCategoryName(categoryName) && categoryRequest.getParentCategoryID() == null) {
            throw new InvalidInputException("Category Name '" + categoryName + "' Already Exists");
        }

        return categoryName;
    }

    private Category validateParentCategory(Category categoryRequest, String categoryName) {
        // Fetch parent category if parentCategoryID is provided
        Category parentCategory;

        if (categoryRequest.getParentCategoryID().getId() == null) {
            throw new InvalidInputException("Parent category ID is required");
        } else {
            parentCategory = categoryRepository.findById(categoryRequest.getParentCategoryID().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Category Not Found"));

            // Check uniqueness within the parent category
            if (categoryRepository.existsByCategoryNameAndParentCategoryID(categoryName, parentCategory)) {
                throw new DuplicateResourceException("Category Name '"+ categoryName +"' already exists under the given parent category");
            }
        }

        return parentCategory;
    }

    private CategoryResponseDTO convertEntityToDTO(Category category) {
        ParentCategoryResponseDTO parentCategoryDTO = null;
        if (category.getParentCategoryID() != null) {
            parentCategoryDTO = new ParentCategoryResponseDTO(
                    category.getParentCategoryID().getId(),
                    category.getIsActive(),
                    category.getParentCategoryID().getCategoryName()
            );
        }

        return new CategoryResponseDTO(
                category.getId(),
                category.getCategoryName(),
                category.getIsActive(),
                parentCategoryDTO
        );
    }

    private List<CategoryResponseDTO> convertEntityListToDTOList(List<Category> categoryList) {
        return categoryList.stream().map(this::convertEntityToDTO).collect(Collectors.toList());
    }

    @Override
    public Category createCategory(Category categoryRequest) {
        try {

            // Validate category name
            String categoryName = validateCategoryName(categoryRequest);
            Category parentCategory = categoryRequest.getParentCategoryID() != null ? validateParentCategory(categoryRequest, categoryName) : null;

            // Create the new category
            Category category = Category.builder()
                    .categoryName(categoryName)
                    .parentCategoryID(parentCategory)
                    .build();

            return categoryRepository.save(category);
        }
        catch (DataIntegrityViolationException e) {
            throw new DuplicateResourceException("Category with the same name already exists");
        }
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return convertEntityListToDTOList(categories);
    }

    @Override
    public List<CategoryResponseDTO> getActiveCategories() {
        List<Category> categoryList = categoryRepository.getActiveCategories();
        return convertEntityListToDTOList(categoryList);
    }

    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public List<Category> getAllCategoriesOfParentById(Integer parentCategoryId) {
        if (!categoryRepository.existsById(parentCategoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + parentCategoryId);
        }

        return categoryRepository.findByParentCategoryID(parentCategoryId);
    }

    @Override
    public List<Category> getCategoriesByName(String categoryName) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(categoryName);
    }

    @Override
    public List<Category> getActiveCategoriesByName(String categoryName) {
        return categoryRepository.findByIsActiveAndCategoryNameContainingIgnoreCase(true, categoryName);
    }

    @Override
    public Category updateCategoryById(Integer id, Category category) {
        Category updatingCategory = getCategoryById(id);

        if (updatingCategory != null) {
            String updatingCategoryName = validateCategoryName(category);
            updatingCategory.setCategoryName(updatingCategoryName);

            if (category.getParentCategoryID() != null) {
                System.out.println(category.getParentCategoryID());
                Category updatingParentCategory = validateParentCategory(category, updatingCategoryName);
                updatingCategory.setParentCategoryID(updatingParentCategory);
            }

            categoryRepository.save(updatingCategory);
        }

        return updatingCategory;
    }

    @Override
    public void deleteCategoryById(Integer categoryId) {
        Category category = getCategoryById(categoryId);

        if (category != null) {

            // Deactivate current category
            category.setIsActive(false);
            categoryRepository.save(category);

            //Deactivate all products associated with this category
            productRepository.deactivateProductsByCategoryId(categoryId);

//            System.out.println("Line 192: " + categoryRepository.getListIDOfChildCategoriesByParentCategoryID(id));
            List<Integer> listIDOfChilds = categoryRepository.getListIDOfChildCategoriesByParentCategoryID(categoryId);

            List<Category> childCategories = categoryRepository.findByParentCategoryID(categoryId);
            if (!childCategories.isEmpty()) {
                categoryRepository.deactivateChildCategories(categoryId);
            }

            for (Integer childCategoryID : listIDOfChilds) {
                productRepository.deactivateProductsByCategoryId(childCategoryID);
            }
        }
    }

    @Override
    @Transactional
    public Category reActiveCategoryById(Integer id) {
        Category category = getCategoryById(id);

        if (category != null) {
            // Activate itself
            category.setIsActive(true);

            if (category.getParentCategoryID() != null) {
                Category parent = category.getParentCategoryID();

                if (!Boolean.TRUE.equals(parent.getIsActive())) {
                    parent.setIsActive(true);
                    categoryRepository.save(parent);
                }
            }


            categoryRepository.save(category);
        }

        return category;
    }

    @Override
    public void deleteAllCategories() {
        categoryRepository.deleteAll();
    }



}
