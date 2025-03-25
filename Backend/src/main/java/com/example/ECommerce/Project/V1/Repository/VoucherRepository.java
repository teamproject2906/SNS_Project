package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    Page<Voucher> findByVoucherCodeContaining(String keyword, Pageable pageable);
}
