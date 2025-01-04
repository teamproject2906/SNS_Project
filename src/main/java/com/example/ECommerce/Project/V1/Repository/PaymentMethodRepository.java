package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {
}
