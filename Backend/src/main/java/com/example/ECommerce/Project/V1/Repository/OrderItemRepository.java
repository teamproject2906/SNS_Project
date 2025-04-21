package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.OrderItem;
import com.example.ECommerce.Project.V1.Model.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId")
    Integer sumQuantityByProductId(Integer productId);

    @Query("SELECT SUM(oi.quantity) " +
            "FROM OrderItem oi " +
            "JOIN oi.orderDetail od " +
            "WHERE oi.product.id = :productId AND od.orderStatus = :status")
    Integer sumQuantityByProductIdAndStatus(Integer productId, OrderStatus status);

    @Query("SELECT oi.product.id, SUM(oi.quantity) " +
            "FROM OrderItem oi " +
            "WHERE oi.orderDetail.orderStatus = :status AND oi.orderDetail.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY oi.product.id " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProductIdsByDateRange(
            @Param("status") OrderStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
}
