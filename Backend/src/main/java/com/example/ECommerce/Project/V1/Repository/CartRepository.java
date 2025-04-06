package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
//    @Query("SELECT c from Cart c WHERE c.user.id = :userId")
//    Cart findByUserID(@Param("userId") int userId);

    Optional<Cart> findByUserId(int userId);
}
