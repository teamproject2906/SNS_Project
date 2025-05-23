package com.example.ECommerce.Project.V1.Model;

import com.example.ECommerce.Project.V1.Model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "sizechart")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class SizeChart extends BaseEntity {

//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "size_chart_id", nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String sizeChartType;

    @Column(nullable = false, length = 10, unique = true)
    private String value;
}
