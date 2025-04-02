package com.example.ECommerce.Project.V1.Service.NumericSizeService;

import com.example.ECommerce.Project.V1.DTO.NumericSizeResponseDTO;
import com.example.ECommerce.Project.V1.DTO.SizeChartResponseDTO;
import com.example.ECommerce.Project.V1.Exception.InvalidInputException;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Model.NumericSize;
import com.example.ECommerce.Project.V1.Model.SizeChart;
import com.example.ECommerce.Project.V1.Repository.NumericSizeRepository;
import com.example.ECommerce.Project.V1.Repository.SizeChartRepository;
import com.example.ECommerce.Project.V1.Service.NumericSizeService.INumericSizeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NumericSizeServiceImpl implements INumericSizeService {

    private final NumericSizeRepository numericSizeRepository;
    private final SizeChartRepository sizeChartRepository;

    public NumericSizeServiceImpl(NumericSizeRepository numericSizeRepository, SizeChartRepository sizeChartRepository) {
        this.numericSizeRepository = numericSizeRepository;
        this.sizeChartRepository = sizeChartRepository;
    }

    private void validateNumericSize(Integer numericSize) {
        if (numericSize == null) {
            throw new InvalidInputException("Numeric Size cannot be null");
        }

        if (numericSize <= 0) {
            throw new InvalidInputException("Numeric Size must be greater than 0");
        }

        if (numericSize > 100) {
            throw new InvalidInputException("Numeric Size must be less than 100");
        }

        if (numericSizeRepository.existsByNumericSize(numericSize)) {
            throw new InvalidInputException("Numeric Size "+ numericSize +" already exists");
        }
    }

    private void validateSizeChart(SizeChart sizeChart) {
        if (sizeChart == null || sizeChart.getId() == null) {
            throw new InvalidInputException("Size Chart is required");
        }

        if(!sizeChartRepository.existsById(sizeChart.getId())) {
            throw new InvalidInputException("Size Chart with the ID: "+ sizeChart.getId() +" does not exist");
        }
    }

    private NumericSizeResponseDTO mapEntityToDTO(NumericSize entity) {
        NumericSizeResponseDTO dto = new NumericSizeResponseDTO();
        dto.setId(entity.getId());
        dto.setNumericSize(entity.getNumericSize());

        SizeChart sizeChart = entity.getSizeChart();
        SizeChartResponseDTO sizeChartDTO = new SizeChartResponseDTO();
        sizeChartDTO.setId(sizeChart.getId());
        sizeChartDTO.setSizeChartType(sizeChart.getSizeChartType());

        dto.setSizeChart(sizeChartDTO);

        return dto;
    }

    private List<NumericSizeResponseDTO> mapEntityListToDTOList(List<NumericSize> entityList) {
        return entityList.stream().map(this::mapEntityToDTO).collect(Collectors.toList());
    }


    @Override
    public NumericSize createNumericSize(NumericSize numericSize) {
        // Validate input fields
        validateSizeChart(numericSize.getSizeChart());
        validateNumericSize(numericSize.getNumericSize());


        // Persist the validated entity
        return numericSizeRepository.save(numericSize);
    }

    @Override
    public List<NumericSizeResponseDTO> getActiveNumericSize() {
        List<NumericSize> numericSizeList = numericSizeRepository.getActiveNumericSizes();
        return mapEntityListToDTOList(numericSizeList);
    }

    @Override
    public List<NumericSizeResponseDTO> getAllNumericSizes() {
        List<NumericSize> numericSizeList = numericSizeRepository.findAll();
        return mapEntityListToDTOList(numericSizeList);
    }

    @Override
    public NumericSize getNumericSizeById(Integer id) {
        return numericSizeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NumericSize not found with id: " + id));
    }

    @Override
    public NumericSize updateNumericSize(Integer id, NumericSize numericSize) {
        NumericSize updatingNumericSize = getNumericSizeById(id);

        if(updatingNumericSize != null) {
            // Validate input data
            validateSizeChart(numericSize.getSizeChart());
            validateNumericSize(numericSize.getNumericSize());

            updatingNumericSize.setNumericSize(numericSize.getNumericSize());
            updatingNumericSize.setSizeChart(numericSize.getSizeChart());

            numericSizeRepository.save(updatingNumericSize);
        }
        return updatingNumericSize;
    }

    @Override
    public void deleteNumericSizeById(Integer id) {
        NumericSize numericSize = numericSizeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NumericSize not found with id: " + id));

        numericSize.setIsActive(false);
       numericSizeRepository.save(numericSize);
    }

    @Override
    public NumericSize toggleNumericSizeStatus(Integer id) {
        NumericSize numericSize = getNumericSizeById(id);

        if (numericSize != null) {
            numericSize.setIsActive(!numericSize.getIsActive());
            numericSizeRepository.save(numericSize);
        }

        return numericSize;
    }
}
