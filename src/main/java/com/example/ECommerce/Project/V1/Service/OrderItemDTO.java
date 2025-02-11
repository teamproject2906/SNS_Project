package com.example.ECommerce.Project.V1.Service;

import lombok.Data;

import java.util.UUID;

@Data
public class OrderItemDTO {
    private Integer id;
    private UUID productId;
    private UUID orderId;
    private Integer quantity;
}
