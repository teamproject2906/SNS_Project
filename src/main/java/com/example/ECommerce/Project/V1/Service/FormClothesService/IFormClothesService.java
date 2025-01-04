package com.example.ECommerce.Project.V1.Service.FormClothesService;

import com.example.ECommerce.Project.V1.Model.FormClothes;

import java.util.List;
import java.util.UUID;

public interface IFormClothesService {

    FormClothes createFormClothes(FormClothes formClothes);
    List<FormClothes> getAllFormClothes();
    FormClothes getFormClothesById(UUID id);
    FormClothes updateFormClothes(UUID id, FormClothes formClothes);
    void deleteFormClothesById(UUID id);
}
