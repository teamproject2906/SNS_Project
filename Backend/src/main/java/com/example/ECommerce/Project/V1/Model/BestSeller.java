package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "best_seller")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class BestSeller extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "best_seller_id", nullable = false, unique = true)
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(name = "quantity_sold", nullable = false)
    private Integer quantitySold;

    // Phương thức để tăng số lượng đã bán
    public void increaseQuantitySold(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to increase must be greater than 0");
        }
        this.quantitySold += quantity;
    }

    // Constructor với product để khởi tạo
    public BestSeller(Product product) {
        this.product = product;
        this.quantitySold = 0; // Khởi tạo số lượng đã bán là 0
    }
}