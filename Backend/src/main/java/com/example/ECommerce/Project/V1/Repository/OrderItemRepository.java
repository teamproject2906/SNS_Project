package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.OrderItem;
import com.example.ECommerce.Project.V1.Model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId")
    Integer sumQuantityByProductId(Integer productId);

    @Query("SELECT SUM(oi.quantity) " +
            "FROM OrderItem oi " +
            "JOIN oi.orderDetail od " +
            "WHERE oi.product.id = :productId AND od.orderStatus = :status")
    Integer sumQuantityByProductIdAndStatus(Integer productId, OrderStatus status);
}
