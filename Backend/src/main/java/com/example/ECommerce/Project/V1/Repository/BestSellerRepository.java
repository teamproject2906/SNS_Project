package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.BestSeller;
import com.example.ECommerce.Project.V1.Model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BestSellerRepository extends JpaRepository<BestSeller, Integer> {

    // Tìm BestSeller theo Product
    Optional<BestSeller> findByProduct(Product product);

    // Tìm BestSeller theo productId
    Optional<BestSeller> findByProductId(Integer productId);

    @Query("SELECT bs FROM BestSeller bs order by bs.quantitySold desc")
    List<BestSeller> findTopByOrderByQuantitySoldDesc(Pageable pageable);
}
