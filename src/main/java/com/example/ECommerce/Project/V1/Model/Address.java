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
@Table(name = "address")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Address extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(columnDefinition = "LONGTEXT")
    private String addressDescription;

    @Column(nullable = false, length = 100)
    private String addressDetail;

    @Column(nullable = false, length = 100)
    private String ward;

    @Column(nullable = false, length = 50)
    private String district;

    @Column(nullable = false, length = 50)
    private String province;

    @Column(nullable = false, length = 50)
    private String country;

    @Column(nullable = false, columnDefinition = "bit default 0")
    private Boolean isDefault;
}
