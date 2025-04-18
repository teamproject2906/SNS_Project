package com.example.ECommerce.Project.V1.Model;

import com.example.ECommerce.Project.V1.Model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "formclothes")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class FormClothes extends BaseEntity {

//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "form_clothes_id", nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String formClothes;
}
