package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "product")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Product extends BaseEntity {

//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false, length = 20, unique = false)
    private String productCode;

    @Column(nullable = false, length = 100)
    private String productName;

    @Column(nullable = false, columnDefinition = "DOUBLE CHECK (`price` >= 0)")
    private Double price;

    @Column(nullable = false, length = 50)
    private String color;

    @Column(nullable = false, length = 100)
    private String material;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer quantityInventory;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(optional = false) // constraint enforces that every Product must have a valid SizeChart (no NULL values allowed)
    @JoinColumn(name = "size_chart_id")
    private SizeChart sizeChart;

    @ManyToOne(optional = false)
    @JoinColumn(name = "form_id")
    private FormClothes formClothes;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    private void validateFields() {
        if (quantityInventory <= 0) {
            throw new IllegalArgumentException("Product quantity must be greater than 0");
        }
    }
}

