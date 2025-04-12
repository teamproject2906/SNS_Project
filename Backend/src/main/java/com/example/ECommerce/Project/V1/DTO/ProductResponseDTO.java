package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {
    private Integer id;
    private String productCode;
    private String productName;
    private Double price;
    private String color;
    private String material;
    private String description;
    private Integer quantityInventory;
    private CategoryResponseDTO category;
    private SizeChartResponseDTO sizeChart;
    private FormClothesResponseDTO formClothes;
    private PromotionResponseDTO promotion;
    private String imageUrl;
    private LocalDateTime createdAt;
    private boolean isActive;
}
