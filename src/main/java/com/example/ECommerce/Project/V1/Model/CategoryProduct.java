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
@Table(name = "categoryproduct")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CategoryProduct extends BaseEntity{

    @EmbeddedId
    private CategoryProductKey id;

    @ManyToOne(optional = false)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(optional = false)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;
}
