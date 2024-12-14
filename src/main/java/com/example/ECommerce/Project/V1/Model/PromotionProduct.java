package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "promotionproduct")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PromotionProduct {

    @EmbeddedId
    private PromotionProductKey id;

    @ManyToOne(optional = false)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(optional = false)
    @MapsId("promotionId")
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
}

