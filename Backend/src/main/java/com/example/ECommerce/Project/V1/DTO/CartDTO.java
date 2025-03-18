package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private Integer id;
    private Integer userId;
    private List<CartItemDTO> items;
    private double totalAmount;
}
