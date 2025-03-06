package com.example.ECommerce.Project.V1.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FormClothesRepository extends JpaRepository<FormClothes, Integer> {

    boolean existsFormClothesByFormClothes(String formClothes);
}
