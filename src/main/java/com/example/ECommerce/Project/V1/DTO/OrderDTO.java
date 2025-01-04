package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private UUID id;
    private UUID userId;
    private LocalDateTime orderDate;
    private LocalDateTime shippingDate;
    private UUID orderStatusId;
    private UUID paymentMethodId;
    private int shippingMethodId;
}
