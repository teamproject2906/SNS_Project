package com.example.ECommerce.Project.V1.Model;

import com.example.ECommerce.Project.V1.Model.BaseEntity;
import com.example.ECommerce.Project.V1.Model.OrderStatus;
import com.example.ECommerce.Project.V1.Model.PaymentMethod;
import com.example.ECommerce.Project.V1.Model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "orderdetail")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class OrderDetail extends BaseEntity {

//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_detail_id", nullable = false, unique = true)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private LocalDateTime shippingDate;

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "order_status_id")
//    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "payment_method_id")
//    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "shipping_method_id")
//    private ShippingMethod shippingMethod;
}

