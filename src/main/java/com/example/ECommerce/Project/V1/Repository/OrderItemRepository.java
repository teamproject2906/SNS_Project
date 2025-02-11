package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}
