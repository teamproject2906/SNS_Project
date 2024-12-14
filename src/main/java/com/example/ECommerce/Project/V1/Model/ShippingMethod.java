package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "shippingmethod")
@SuperBuilder
public class ShippingMethod extends BaseEntity{
    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false, length = 100)
    private String shippingTypeName;
}
