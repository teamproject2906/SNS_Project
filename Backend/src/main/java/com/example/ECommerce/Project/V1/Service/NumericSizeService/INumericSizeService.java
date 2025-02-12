package com.example.ECommerce.Project.V1.Service.NumericSizeService;

import com.example.ECommerce.Project.V1.Model.NumericSize;

import java.util.List;

public interface INumericSizeService {

    NumericSize createNumericSize(NumericSize numericSize);
    List<NumericSize> getAllNumericSizes();
    NumericSize getNumericSizeById(Integer id);
    NumericSize updateNumericSize(Integer id, NumericSize numericSize);
    void deleteNumericSizeById(Integer id);
}
