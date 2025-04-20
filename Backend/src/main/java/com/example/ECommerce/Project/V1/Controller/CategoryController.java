package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.CategoryResponseDTO;
import com.example.ECommerce.Project.V1.Helper.ValidateRole;
import com.example.ECommerce.Project.V1.Model.Category;
import com.example.ECommerce.Project.V1.Service.CategoryService.ICategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    // Declare the category service
    private final ICategoryService categoryService;
    private final ValidateRole validateRole;

    public CategoryController(ICategoryService categoryService, ValidateRole validateRole) {
        this.categoryService = categoryService;
        this.validateRole = validateRole;
    }

    @PostMapping()
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (isAdminOrStaff) {
            return ResponseEntity.status(HttpStatus.OK).body(categoryService.getAllCategories());
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(categoryService.getActiveCategories());
        }
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Object> getCategoryById(@PathVariable("categoryId") Integer categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (!isAdminOrStaff && !category.getIsActive()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is no category with id: " + categoryId);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getCategoryById(categoryId));
    }

    @GetMapping("/parent/{parentCategoryId}")
    public ResponseEntity<Object> getCategoryByParentCategoryId(@PathVariable("parentCategoryId") Integer parentId) {
        List<Category> categoryList = categoryService.getAllCategoriesOfParentById(parentId);

        if (categoryList.isEmpty()) {
            return ResponseEntity.ok().body("There is no category which has parent category id " + parentId);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryList);
    }

    @GetMapping("/search")
    public ResponseEntity<Object> getCategoryByName(@RequestParam("name") String categoryName) {
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (isAdminOrStaff) {
            List<Category> categories = categoryService.getCategoriesByName(categoryName);

            if (categories.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is no category with name: " + categoryName);

            return ResponseEntity.status(HttpStatus.OK).body(categories);
        } else {
            List<Category> categories = categoryService.getActiveCategoriesByName(categoryName);
            if (categories.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is no category with name: " + categoryName);

            return ResponseEntity.status(HttpStatus.OK).body(categories);
        }
    }

    @PatchMapping("/{categoryId}")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Category> updateCategory(@PathVariable("categoryId") Integer categoryId, @RequestBody Category category) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.updateCategoryById(categoryId, category));
    }

    @PatchMapping("/reactive/{categoryId}")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Category> reactiveCategoryById(@PathVariable("categoryId") Integer categoryId) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.reActiveCategoryById(categoryId));
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<String> deActiveCategoryById(@PathVariable("categoryId") Integer categoryId) {
       categoryService.deleteCategoryById(categoryId);

       return ResponseEntity.status(HttpStatus.OK).body("Deactive Category");
    }
}
