package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Model.Category;
import com.example.ECommerce.Project.V1.Service.CategoryService.ICategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    // Declare the category service
    private final ICategoryService categoryService;

    public CategoryController(ICategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping()
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getAllCategories());
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable("categoryId") Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getCategoryById(id));
    }

    @GetMapping("/parent/{parentCategoryId}")
    public ResponseEntity<List<Category>> getCategoryByParentCategoryId(@PathVariable("parentCategoryId") Integer parentId) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getAllCategoriesOfParentById(parentId));
    }

    @GetMapping("/name/{categoryName}")
    public ResponseEntity<List<Category>> getCategoryByName(@PathVariable("categoryName") String categoryName) {
        List<Category> categories = categoryService.getAllCategoriesByName(categoryName);
        if (categories.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categories);
    }

    @PatchMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(@PathVariable("categoryId") Integer categoryId, @RequestBody Category category) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.updateCategoryById(categoryId, category));
    }

    @PatchMapping("/reactive/{categoryId}")
    public ResponseEntity<Category> reactiveCategoryById(@PathVariable("categoryId") Integer categoryId) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.reActiveCategoryById(categoryId));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deActiveCategoryById(@PathVariable("categoryId") Integer categoryId) {
       categoryService.deleteCategoryById(categoryId);

       return ResponseEntity.status(HttpStatus.OK).body("Deactive Category");
    }
}
