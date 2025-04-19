package com.example.ECommerce.Project.V1.DTO;

import com.example.ECommerce.Project.V1.Model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Integer id;
    private Integer quantity;
    private double unitPrice;
    private Integer productId;
    private Product product;
    private String imageUrl;
    private Integer cartId;
}
