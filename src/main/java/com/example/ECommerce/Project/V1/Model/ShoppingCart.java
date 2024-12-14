package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "shoppingcart")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ShoppingCart extends BaseEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private Integer quantityPurchase;

    private void validateFields() {
        if (quantityPurchase <= 0) {
            throw new IllegalArgumentException("Product quantity must be greater than 0");
        }
    }
}

