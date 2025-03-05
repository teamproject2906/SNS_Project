package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "cartitem")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CartItem extends BaseEntity {

//    @Id
//    @GeneratedValue( generator = "uuid2" )
//    @UuidGenerator
//    @Column(columnDefinition = "VARCHAR(36)")
//    @JdbcTypeCode(SqlTypes.VARCHAR)
//    private UUID id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id", nullable = false, unique = true)
    private Integer id;

    @OneToOne()
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shopping_session_id")
    private ShoppingSession shoppingSession;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double amount;
}
