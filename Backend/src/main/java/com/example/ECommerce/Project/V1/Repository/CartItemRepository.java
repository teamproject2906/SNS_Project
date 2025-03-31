package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    void deleteAllByCart_Id(int id);
}
