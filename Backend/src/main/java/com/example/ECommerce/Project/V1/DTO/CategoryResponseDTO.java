package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponseDTO {
    private Integer id;
    private String categoryName;
    private boolean isActive;
    private ParentCategoryResponseDTO parentCategory;
}