package com.example.ECommerce.Project.V1.Service.AlphabetSizeService;

import com.example.ECommerce.Project.V1.DTO.AlphabetSizeResponseDTO;
import com.example.ECommerce.Project.V1.Model.AlphabetSize;

import java.util.List;
import java.util.UUID;

public interface IAlphabetSizeService {

    AlphabetSizeResponseDTO createAlphabetSize(AlphabetSize alphabetSize);
    List<AlphabetSize> getAllAlphabetSize();
    AlphabetSize getAlphabetSizeById(Integer id);
    AlphabetSize updateAlphabetSize(Integer id, AlphabetSize alphabetSize);
    void deleteAlphabetSizeById(Integer id);

}
