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
@Table(name = "alphabetsize")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class AlphabetSize extends BaseEntity{

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_chart_id")
    private SizeChart sizeChart;

    @Column(nullable = false, unique = true, length = 50)
    private String alphabetSize;
}
