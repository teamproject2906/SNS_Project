package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.FormClothes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FormClothesRepository extends JpaRepository<FormClothes, UUID> {

    boolean existsFormClothesByFormClothes(String formClothes);
}
