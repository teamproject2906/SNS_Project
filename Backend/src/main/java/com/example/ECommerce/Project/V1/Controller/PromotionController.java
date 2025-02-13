package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Model.Promotion;
import com.example.ECommerce.Project.V1.Service.PromotionService.IPromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {
    private final IPromotionService promotionService;

    public PromotionController(IPromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping()
    public ResponseEntity<Promotion> addNewPromotion(@RequestBody Promotion promotion) {
        return new ResponseEntity<>(promotionService.addPromotion(promotion), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return new ResponseEntity<>(promotionService.getAllPromotions(), HttpStatus.OK);
    }

    @GetMapping("/{promotionId}")
    public ResponseEntity<Promotion> getPromotion(@PathVariable Integer promotionId) {
        return new ResponseEntity<>(promotionService.getPromotionById(promotionId), HttpStatus.OK);
    }

    @PatchMapping("/{promotionId}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Integer promotionId, @RequestBody Promotion promotion) {
        return new ResponseEntity<>(promotionService.updatePromotionById(promotionId, promotion), HttpStatus.OK);
    }

    @PatchMapping("/reactive/{promotionId}")
    public ResponseEntity<Promotion> reActivePromotion(@PathVariable Integer promotionId) {
        return new ResponseEntity<>(promotionService.reActivatePromotionById(promotionId), HttpStatus.OK);
    }

    @DeleteMapping("/{promotionId}")
    public ResponseEntity<String> deletePromotion(@PathVariable Integer promotionId) {
        promotionService.deletePromotionById(promotionId);
        return new ResponseEntity<>("Promotion deactive successfully ", HttpStatus.OK);
    }
}
