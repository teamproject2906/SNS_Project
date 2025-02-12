package com.example.ECommerce.Project.V1.Service.SizeChartService;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Model.SizeChart;

import java.util.List;
import java.util.UUID;

public interface ISizeChartService {

    SizeChart createSizeChart(SizeChart sizeChart);
    List<SizeChartResponseDTO> getAllSizeChart();
    SizeChart getSizeChartById(UUID id);
    SizeChart updateSizeChartById(UUID id, SizeChart sizeChart);
    void deleteSizeChartById(UUID id);
}
