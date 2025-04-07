package com.example.ECommerce.Project.V1.Service.SizeChartService;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SizeChartServiceImpl implements ISizeChartService {

    private final SizeChartRepository repository;

    public SizeChartServiceImpl(SizeChartRepository repository) {
        this.repository = repository;
    }

    // Method to map SizeChart to SizeChartResponseDTO
    private SizeChartResponseDTO mapEntityToDTO(SizeChart entity) {
        SizeChartResponseDTO dto = new SizeChartResponseDTO();

        dto.setId(entity.getId());
        dto.setSizeChartType(entity.getSizeChartType());
        dto.setValue(entity.getValue());
        dto.setActive(entity.getIsActive());

        return dto;
    }

    // Method to map List of SizeChart Entity to List of SizeChartResponseDTO
    private List<SizeChartResponseDTO> mapEntityListToDTOList(List<SizeChart> entityList) {
        return entityList.stream()
                .map(this :: mapEntityToDTO)
                .collect(Collectors.toList());
    }

    // Validation function
    private SizeChart validateSizeChart(SizeChart sizeChart) {

        if (sizeChart == null || sizeChart.getSizeChartType() == null || sizeChart.getValue() == null) {
            throw new InvalidInputException("Size Chart cannot be null");
        }

        String sizeChartType = sizeChart.getSizeChartType().trim();
        if (sizeChartType.isBlank()) {
            throw new InvalidInputException("Size Chart Type is required");
        }

        if (sizeChartType.length() > 100) {
            throw new InvalidInputException("Size Chart Type is longer than 100 characters");
        }

        if(!sizeChartType.matches("^[a-zA-Z0-9\\s']+$")) {
            System.out.println(sizeChartType);
            throw new InvalidInputException("Size chart name can only contain alphanumeric characters and spaces.");
        }

        String sizeValue = sizeChart.getValue().trim();
        if (sizeValue.isBlank()) {
            throw new InvalidInputException("Size value is required");
        }

        if (sizeValue.length() > 10) {
            throw new InvalidInputException("Size value is longer than 10 characters");
        }

        // Set the trimmed and validated value back to the SizeChart object
        sizeChart.setSizeChartType(sizeChartType);
        sizeChart.setValue(sizeValue);
        return sizeChart;
    }

    // Method to create a SizeChart
    @Override
    public SizeChart createSizeChart(SizeChart sizeChart) {
        SizeChart validatedSizeChart = validateSizeChart(sizeChart);
        return repository.save(validatedSizeChart);
    }

    @Override
    public List<SizeChartResponseDTO> getAllSizeChart() {
        List<SizeChart> sizeCharts = repository.findAll();
        return mapEntityListToDTOList(sizeCharts);
    }

    @Override
    public SizeChart getSizeChartById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SizeChart not found with id: " + id));
    }

    @Override
    public SizeChart updateSizeChartById(Integer id, SizeChart sizeChart) {
        SizeChart updateSizeChart = getSizeChartById(id);

        SizeChart validatedSizeChart = validateSizeChart(sizeChart);

        updateSizeChart.setSizeChartType(validatedSizeChart.getSizeChartType());
        updateSizeChart.setValue(validatedSizeChart.getValue());
        updateSizeChart.setIsActive(validatedSizeChart.getIsActive());
        repository.save(updateSizeChart);

        return updateSizeChart;
    }

    @Override
    public void deactivateSizeChartById(Integer id) {
       SizeChart sizeChart = getSizeChartById(id);

       if (sizeChart != null) {
           sizeChart.setIsActive(false);
           repository.save(sizeChart);
       }
    }

    @Override
    public SizeChart reActivateSizeChartById(Integer id) {
        SizeChart sizeChart = getSizeChartById(id);

        if (sizeChart != null) {
            sizeChart.setIsActive(true);
            repository.save(sizeChart);
        }

        return sizeChart;
    }
}
