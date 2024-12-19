package com.example.ECommerce.Project.V1.Service.NumericSizeService;

import com.example.ECommerce.Project.V1.Model.NumericSize;

import java.util.List;
import java.util.UUID;

public interface INumericSizeService {

    NumericSize createNumericSize(NumericSize numericSize);
    List<NumericSize> getAllNumericSizes();
    NumericSize getNumericSizeById(UUID id);
    NumericSize updateNumericSize(UUID id, NumericSize numericSize);
    void deleteNumericSizeById(UUID id);
}
