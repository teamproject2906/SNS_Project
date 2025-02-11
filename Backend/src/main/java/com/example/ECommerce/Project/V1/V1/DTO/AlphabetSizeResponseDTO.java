package com.example.ECommerce.Project.V1.V1.DTO;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlphabetSizeResponseDTO {
    private Integer id;
    private String alphabetSize;
    private SizeChartResponseDTO sizeChart;
}
