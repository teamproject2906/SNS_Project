package com.example.ECommerce.Project.V1.Repository;


import com.example.ECommerce.Project.V1.Model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, UUID> {
}
