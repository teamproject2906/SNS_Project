package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NumericSizeResponseDTO {
    private Integer id;
    private Integer numericSize;
    private SizeChartResponseDTO sizeChart;

}
