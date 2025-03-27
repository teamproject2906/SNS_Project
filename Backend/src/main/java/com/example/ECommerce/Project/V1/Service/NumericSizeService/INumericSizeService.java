package com.example.ECommerce.Project.V1.Service.NumericSizeService;

import com.example.ECommerce.Project.V1.DTO.NumericSizeResponseDTO;
import com.example.ECommerce.Project.V1.Model.NumericSize;

import java.util.List;
import java.util.UUID;

public interface INumericSizeService {

    NumericSize createNumericSize(NumericSize numericSize);
    List<NumericSizeResponseDTO> getAllNumericSizes();
    NumericSize getNumericSizeById(Integer id);
    NumericSize updateNumericSize(Integer id, NumericSize numericSize);
    void deleteNumericSizeById(Integer id);
    NumericSize reActivateNumericSizeById(Integer id);
}
