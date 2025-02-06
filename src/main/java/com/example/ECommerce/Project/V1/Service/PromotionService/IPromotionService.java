package com.example.ECommerce.Project.V1.Service.PromotionService;

import com.example.ECommerce.Project.V1.Model.Promotion;

import java.util.List;
import java.util.UUID;

public interface IPromotionService {

    Promotion addPromotion(Promotion promotion);
    List<Promotion> getAllPromotions();
    Promotion getPromotionById(UUID id);
    Promotion updatePromotionById(UUID id ,Promotion promotion);
    void  deletePromotionById(UUID id);
    Promotion reActivatePromotionById(UUID id);
}
