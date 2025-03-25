package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
}
