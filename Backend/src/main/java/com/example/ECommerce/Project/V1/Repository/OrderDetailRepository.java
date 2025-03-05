package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    OrderDetail findFirstByOrderByCreatedAtDesc();

    @Query("SELECT o from OrderDetail o order by o.id DESC LIMIT 1")
    OrderDetail findLastInsertedOrder();
}

