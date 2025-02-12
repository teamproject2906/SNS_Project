package com.example.ECommerce.Project.V1.Service.AlphabetSizeService;

import com.example.ECommerce.Project.V1.DTO.AlphabetSizeResponseDTO;
import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Repository.AlphabetSizeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlphabetSizeServiceImpl implements IAlphabetSizeService {

    private final AlphabetSizeRepository repository;

    public AlphabetSizeServiceImpl(AlphabetSizeRepository repository) {
        this.repository = repository;
    }

   private AlphabetSizeResponseDTO mapAlphabetSizeToDTO(AlphabetSize alphabetSize) {
        AlphabetSizeResponseDTO dto = new AlphabetSizeResponseDTO();
        dto.setId(alphabetSize.getId());
        dto.setAlphabetSize(alphabetSize.getAlphabetSize());

        SizeChart sizeChart = alphabetSize.getSizeChart();
        SizeChartResponseDTO sizeChartDTO = new SizeChartResponseDTO();
        sizeChartDTO.setId(sizeChart.getId());
        sizeChartDTO.setSizeChartType(sizeChart.getSizeChartType());

        dto.setSizeChart(sizeChartDTO);

        return dto;
   }


    @Override
    public AlphabetSizeResponseDTO createAlphabetSize(AlphabetSize alphabetSize) {
        AlphabetSize newAlphabetSize = repository.save(alphabetSize);
        AlphabetSizeResponseDTO dto = mapAlphabetSizeToDTO(newAlphabetSize);
        return dto;
    }

    @Override
    public List<AlphabetSize> getAllAlphabetSize() {
        List<AlphabetSize> alphabetSizeList = repository.findAll();
        return alphabetSizeList;
    }

    @Override
    public AlphabetSize getAlphabetSizeById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("AlphabetSize not found with id: " + id));
    }

    @Override
    public AlphabetSize updateAlphabetSize(Integer id, AlphabetSize alphabetSize) {
        // Check if the AllphabetSize exists
        AlphabetSize updatingAlphabetSize = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("AlphabetSize not found with id: " + id));

        // Update fields from the provided object
        updatingAlphabetSize.setSizeChart(alphabetSize.getSizeChart());
        updatingAlphabetSize.setAlphabetSize(alphabetSize.getAlphabetSize());

        // Save the updated entity
        return repository.save(updatingAlphabetSize);
    }

    @Override
    public void deleteAlphabetSizeById(Integer id) {
        AlphabetSize alphabetSize = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("AlphabetSize not found with id: " + id));

        repository.delete(alphabetSize);
    }
}
