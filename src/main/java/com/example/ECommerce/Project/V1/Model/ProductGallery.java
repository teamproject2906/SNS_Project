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
@Table(name = "productgallery")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ProductGallery extends BaseEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Lob
    private byte[] imageUrl;

    @Column(nullable = false, columnDefinition = "bit default 0")
    private Boolean isThumbnail;

    @Column(nullable = false)
    private Integer sortOrder;
}

