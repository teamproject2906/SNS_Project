package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherDTO {
    private Integer id;
    private String voucherCode;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double discount;
    private Integer usageLimit;
    private Boolean isActive;
}
