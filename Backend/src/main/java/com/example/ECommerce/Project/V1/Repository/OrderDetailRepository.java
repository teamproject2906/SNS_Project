package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.OrderDetail;
import com.example.ECommerce.Project.V1.Model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    OrderDetail findFirstByOrderByCreatedAtDesc();

    @Query("SELECT o FROM OrderDetail o WHERE o.user.id = :userId AND o.orderStatus = :orderStatus")
    List<OrderDetail> findByUserIdAndOrderStatus(
            @Param("userId") Integer userId,
            @Param("orderStatus") OrderStatus orderStatus
    );
}

