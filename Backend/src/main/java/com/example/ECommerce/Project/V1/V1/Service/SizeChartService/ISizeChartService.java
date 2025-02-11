package com.example.ECommerce.Project.V1.V1.Service.SizeChartService;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Model.SizeChart;

import java.util.List;

public interface ISizeChartService {

    SizeChart createSizeChart(SizeChart sizeChart);
    List<SizeChartResponseDTO> getAllSizeChart();
    SizeChart getSizeChartById(Integer id);
    SizeChart updateSizeChartById(Integer id, SizeChart sizeChart);
    void deleteSizeChartById(Integer id);
}
