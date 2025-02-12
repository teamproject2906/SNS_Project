package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "alphabetsize")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class AlphabetSize extends BaseEntity {

//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alphabet_size_id", nullable = false, unique = true)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_chart_id")
    private SizeChart sizeChart;

    @Column(nullable = false, unique = true, length = 50)
    private String alphabetSize;
}
