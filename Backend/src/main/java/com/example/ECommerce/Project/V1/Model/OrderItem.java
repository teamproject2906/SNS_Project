package com.example.ECommerce.Project.V1.Model;

import com.example.ECommerce.Project.V1.Model.BaseEntity;
import com.example.ECommerce.Project.V1.Model.OrderDetail;
import com.example.ECommerce.Project.V1.Model.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "orderitem")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class OrderItem extends BaseEntity {

//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id", nullable = false, unique = true)
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private OrderDetail orderDetail;
}
