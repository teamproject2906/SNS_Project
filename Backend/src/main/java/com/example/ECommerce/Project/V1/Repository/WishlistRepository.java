package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    Optional<Wishlist> findByUserId(Integer userId);
}
