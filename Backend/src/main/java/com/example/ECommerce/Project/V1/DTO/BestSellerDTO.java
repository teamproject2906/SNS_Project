package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BestSellerDTO {

    private Integer id;         // ID của BestSeller
    private Integer productId;  // ID của Product
    private Integer quantitySold; // Số lượng đã bán
}
