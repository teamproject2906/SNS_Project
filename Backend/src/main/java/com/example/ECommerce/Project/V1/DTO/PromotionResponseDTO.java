package com.example.ECommerce.Project.V1.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionResponseDTO {
    private Integer id;
    private String name;
    private Double discount;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
