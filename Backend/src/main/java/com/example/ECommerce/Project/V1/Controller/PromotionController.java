package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.PromotionResponseDTO;
import com.example.ECommerce.Project.V1.Helper.ValidateRole;
import com.example.ECommerce.Project.V1.Model.Promotion;
import com.example.ECommerce.Project.V1.Service.PromotionService.IPromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final IPromotionService promotionService;
    private final ValidateRole validateRole;

    public PromotionController(IPromotionService promotionService, ValidateRole validateRole) {
        this.promotionService = promotionService;
        this.validateRole = validateRole;
    }

    @PostMapping()
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Promotion> addNewPromotion(@RequestBody Promotion promotion) {
        return new ResponseEntity<>(promotionService.addPromotion(promotion), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<PromotionResponseDTO>> getAllPromotions() {
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (isAdminOrStaff) {
            return new ResponseEntity<>(promotionService.getAllPromotions(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(promotionService.getActivePromotions(), HttpStatus.OK);
        }
    }

    @GetMapping("/{promotionId}")
    public ResponseEntity<Promotion> getPromotion(@PathVariable Integer promotionId) {
        Promotion promotion = promotionService.getPromotionById(promotionId);
        boolean isAdminOrStaff = validateRole.isAdminOrStaff();

        if (!isAdminOrStaff && !promotion.getIsActive()) {
            return ResponseEntity.notFound().build();
        }

        return new ResponseEntity<>(promotionService.getPromotionById(promotionId), HttpStatus.OK);
    }

    @PatchMapping("/{promotionId}")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Integer promotionId, @RequestBody Promotion promotion) {
        return new ResponseEntity<>(promotionService.updatePromotionById(promotionId, promotion), HttpStatus.OK);
    }

    @PatchMapping("/{promotionId}/toggle-status")
    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<Promotion> togglePromotionStatusById(@PathVariable Integer promotionId) {
        return new ResponseEntity<>(promotionService.togglePromotionStatus(promotionId), HttpStatus.OK);
    }

//    @DeleteMapping("/{promotionId}")
//    @PreAuthorize(value = "hasRole('ADMIN') or hasRole('STAFF')")
//    public ResponseEntity<String> deletePromotion(@PathVariable Integer promotionId) {
//        promotionService.deletePromotionById(promotionId);
//        return new ResponseEntity<>("Promotion deactive successfully ", HttpStatus.OK);
//    }
}
