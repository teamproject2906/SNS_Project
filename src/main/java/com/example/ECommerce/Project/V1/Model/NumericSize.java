package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "numericsize")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class NumericSize extends BaseEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_chart_id")
    private SizeChart sizeChart;

    @Column(nullable = false, unique = true)
    private Integer numericSize;
}

