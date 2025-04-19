package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    List<Voucher> findByVoucherCodeContaining(String keyword);
}
