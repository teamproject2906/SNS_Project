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
@Table(name = "orderline")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class OrderLine extends BaseEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shopping_cart_id")
    private ShoppingCart shoppingCart;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private Integer productQuantityPurchase;

    @Column(nullable = false)
    private Double totalPrice;

    private void validateProductOrShoppingCart() {
        if ((product == null && shoppingCart == null) ||
                (product != null && shoppingCart != null)) {
            throw new IllegalArgumentException("Either product or ShoppingCart must be set, but not both.");
        }
    }

    private void validateFields() {
        if (productQuantityPurchase <= 0) {
            throw new IllegalArgumentException("Product quantity must be greater than 0");
        }
        if (totalPrice <= 0) {
            throw new IllegalArgumentException("Total price must be greater than 0");
        }
    }
}