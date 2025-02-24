package com.example.ECommerce.Project.V1.DTO;

import lombok.Data;

import java.util.UUID;

@Data
public class OrderItemDTO {
    private Integer id;
    private Integer productId;
    private Integer orderId;
    private Integer quantity;
}
