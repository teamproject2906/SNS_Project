package com.example.ECommerce.Project.V1.Service.NumericSizeService;

import com.example.ECommerce.Project.V1.Model.NumericSize;
import com.example.ECommerce.Project.V1.Repository.NumericSizeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NumericSizeServiceImpl implements INumericSizeService {

    private final NumericSizeRepository repository;

    public NumericSizeServiceImpl(NumericSizeRepository repository) {
        this.repository = repository;
    }

    @Override
    public NumericSize createNumericSize(NumericSize numericSize) {
        return repository.save(numericSize);
    }

    @Override
    public List<NumericSize> getAllNumericSizes() {
        List<NumericSize> numericSizeList = repository.findAll();
        return numericSizeList;
    }

    @Override
    public NumericSize getNumericSizeById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("NumericSize not found with id: " + id));
    }

    @Override
    public NumericSize updateNumericSize(UUID id, NumericSize numericSize) {
        NumericSize updatingNumericSize = getNumericSizeById(id);

        if(updatingNumericSize != null) {
            updatingNumericSize.setNumericSize(numericSize.getNumericSize());
            updatingNumericSize.setSizeChart(numericSize.getSizeChart());

            repository.save(updatingNumericSize);
        }
        return updatingNumericSize;
    }

    @Override
    public void deleteNumericSizeById(UUID id) {
        NumericSize numericSize = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("NumericSize not found with id: " + id));

        repository.delete(numericSize);
    }
}
