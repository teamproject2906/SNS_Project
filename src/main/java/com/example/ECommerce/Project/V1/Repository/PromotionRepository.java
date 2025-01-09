package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Promotion;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PromotionRepository extends JpaRepository<Promotion, UUID> {

    @Modifying
    @Transactional
    @Query("UPDATE Promotion p SET p.isActive = false WHERE p.id=:id")
    void deActivatePromotion(@Param("id") UUID promotionId);

    @Modifying
    @Transactional
    @Query("UPDATE Promotion p SET p.isActive = true WHERE p.id=:id")
    void reActivatePromotion(@Param("id") UUID promotionId);
}
