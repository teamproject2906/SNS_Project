package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "category")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Category extends BaseEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 100)
    private String categoryName;

    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private Category parentCategoryID;
}

