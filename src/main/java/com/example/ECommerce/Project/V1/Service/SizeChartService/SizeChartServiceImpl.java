package com.example.ECommerce.Project.V1.Service.SizeChartService;

import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
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

        return dto;
    }

    // Method to map List of SizeChart Entity to List of SizeChartResponseDTO
    private List<SizeChartResponseDTO> mapEntityListToDTOList(List<SizeChart> entityList) {
        return entityList.stream()
                .map(this :: mapEntityToDTO)
                .collect(Collectors.toList());
    }


    // Method to create a SizeChart
    @Override
    public SizeChart createSizeChart(SizeChart sizeChart) {
        return repository.save(sizeChart);
    }

    @Override
    public List<SizeChartResponseDTO> getAllSizeChart() {
        List<SizeChart> sizeCharts = repository.findAll();
        return mapEntityListToDTOList(sizeCharts);
    }

    @Override
    public SizeChart getSizeChartById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("SizeChart not found with id: " + id));
    }

    @Override
    public SizeChart updateSizeChartById(UUID id, SizeChart sizeChart) {
        SizeChart updateSizeChart = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("SizeChart not found with id: " + id));

        if (updateSizeChart != null) {
            updateSizeChart.setSizeChartType(sizeChart.getSizeChartType());
            repository.save(updateSizeChart);
        } else {
            throw new EntityNotFoundException("SizeChart not found with id: " + id);
        }

        return updateSizeChart;
    }

    @Override
    public void deleteSizeChartById(UUID id) {
       SizeChart sizeChart = repository.findById(id)
               .orElseThrow(() -> new EntityNotFoundException("SizeChart not found with id: " + id));

       repository.delete(sizeChart);
    }
}
