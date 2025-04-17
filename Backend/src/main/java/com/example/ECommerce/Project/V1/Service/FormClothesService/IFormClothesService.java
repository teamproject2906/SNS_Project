package com.example.ECommerce.Project.V1.Service.FormClothesService;

import com.example.ECommerce.Project.V1.DTO.FormClothesResponseDTO;
import com.example.ECommerce.Project.V1.Model.FormClothes;

import java.util.List;
import java.util.UUID;

public interface IFormClothesService {

    FormClothes createFormClothes(FormClothes formClothes);
    List<FormClothesResponseDTO> getAllFormClothes();
    FormClothes getFormClothesById(Integer id);
    FormClothes updateFormClothes(Integer id, FormClothes formClothes);
    void deActiveFormClothesById(Integer id);
    FormClothes reActiveFormClothesById(Integer id);
}
