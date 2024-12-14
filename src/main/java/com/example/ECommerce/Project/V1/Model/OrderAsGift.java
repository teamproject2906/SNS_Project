package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "orderasgift")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class OrderAsGift extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 50)
    private String firstname;

    @Column(nullable = false, length = 50)
    private String lastname;

    @Column(nullable = false, length = 11)
    private String phoneNumber;

    @ManyToOne(optional = false)
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shopping_cart_id")
    private ShoppingCart shoppingCart;

    @Column(nullable = false)
    private Integer productQuantityPurchase;

    @Column(length = 200)
    private String noteToShipper;

    @Column(length = 500)
    private String personalLetterContent;

    @Lob
    private byte[] attachedImage;

    @Column(nullable = false)
    private Double totalPrice;

    private void validateProductOrShoppingCart() {
        if ((product == null && shoppingCart == null) ||
                (product != null && shoppingCart != null)) {
            throw new IllegalArgumentException("Either product or ShoppingCart must be set, but not both.");
        }
    }

    /*
    The error occurs because MySQL does not allow a CHECK constraint on a column that references another column.
    In your entity, the column definitions for productQuantityPurchase and totalPrice use
    CHECK constraints, but MySQL treats those constraints as invalid if they are interpreted as
    referencing other columns or calculated values.
     */
    private void validateFields() {
        if (productQuantityPurchase <= 0) {
            throw new IllegalArgumentException("Product quantity must be greater than 0");
        }
        if (totalPrice <= 0) {
            throw new IllegalArgumentException("Total price must be greater than 0");
        }
    }
}