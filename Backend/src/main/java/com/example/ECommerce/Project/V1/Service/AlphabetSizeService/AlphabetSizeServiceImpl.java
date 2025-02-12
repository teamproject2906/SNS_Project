package com.example.ECommerce.Project.V1.Service.AlphabetSizeService;

import com.example.ECommerce.Project.V1.DTO.AlphabetSizeResponseDTO;
import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.AlphabetSize;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Repository.AlphabetSizeRepository;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AlphabetSizeServiceImpl implements IAlphabetSizeService {

    private final AlphabetSizeRepository alphabetSizeRepository;
    private final SizeChartRepository sizeChartRepository;

    public AlphabetSizeServiceImpl(AlphabetSizeRepository repository, SizeChartRepository sizeChartRepository) {
        this.alphabetSizeRepository = repository;
        this.sizeChartRepository = sizeChartRepository;
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

   private String validateAlphabetSize(String alphabetSize) {
        if (alphabetSize == null || alphabetSize.isBlank()) {
            throw new InvalidInputException("Alphabet Size is required");
        }

        alphabetSize = alphabetSize.trim().toUpperCase();

        if (alphabetSize.isEmpty()) {
            throw new InvalidInputException("Alphabet Size is required");
        }

        if (alphabetSize.length() > 50) {
            throw new InvalidInputException("Alphabet Size cannot exceed 50 characters");
        }

        if (!alphabetSize.matches("^[a-zA-Z\\s]+$")) {
            throw new InvalidInputException("Alphabet Size can only contain lowercase or uppercase letters from 'a' to 'z'");
        }

        if(alphabetSizeRepository.existsAlphabetSizeByAlphabetSize(alphabetSize)) {
            throw new InvalidInputException("Alphabet Size "+ alphabetSize +" already exists");
        }

        return alphabetSize;
   }

   private void validateSizeChart(SizeChart sizeChart) {
        if (sizeChart == null || sizeChart.getId() == null) {
            throw new InvalidInputException("Size Chart is required");
        }

        if(!sizeChartRepository.existsById(sizeChart.getId())) {
            throw new InvalidInputException("Size Chart with the ID: "+ sizeChart.getId() +" does not exist");
        }
   }


    @Override
    public AlphabetSizeResponseDTO createAlphabetSize(AlphabetSize alphabetSize) {
        validateSizeChart(alphabetSize.getSizeChart());
        String validatedAlphabetSize = validateAlphabetSize(alphabetSize.getAlphabetSize());

        alphabetSize.setAlphabetSize(validatedAlphabetSize);

        AlphabetSize newAlphabetSize = alphabetSizeRepository.save(alphabetSize);
        AlphabetSizeResponseDTO responseDTO = mapAlphabetSizeToDTO(newAlphabetSize);
        return responseDTO;
    }

    @Override
    public List<AlphabetSize> getAllAlphabetSize() {
        List<AlphabetSize> alphabetSizeList = alphabetSizeRepository.findAll();
        return alphabetSizeList;
    }

    @Override
    public AlphabetSize getAlphabetSizeById(UUID id) {
        return alphabetSizeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AlphabetSize not found with id: " + id));
    }

    @Override
    public AlphabetSize updateAlphabetSize(UUID id, AlphabetSize alphabetSize) {
        // Check if the AllphabetSize exists
        AlphabetSize updatingAlphabetSize = getAlphabetSizeById(id);

        // Validate update data
        validateSizeChart(alphabetSize.getSizeChart());
        String validatedAlphabetSize = validateAlphabetSize(alphabetSize.getAlphabetSize());

        // Update fields from the provided object
        updatingAlphabetSize.setAlphabetSize(validatedAlphabetSize);

        // Save the updated entity
        return alphabetSizeRepository.save(updatingAlphabetSize);
    }

    @Override
    public void deleteAlphabetSizeById(UUID id) {
        AlphabetSize alphabetSize = getAlphabetSizeById(id);
        alphabetSizeRepository.delete(alphabetSize);
    }
}
