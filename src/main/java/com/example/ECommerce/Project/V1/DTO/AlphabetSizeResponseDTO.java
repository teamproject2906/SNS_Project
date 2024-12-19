package com.example.ECommerce.Project.V1.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlphabetSizeResponseDTO {

    private UUID id;
    private String alphabetSize;
    private SizeChartResponseDTO sizeChart;
}
