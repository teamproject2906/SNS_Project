package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUserId(Integer userId);
    List<Address> findByUserIdAndIsDefault(Integer userId, Boolean isDefault);
}
