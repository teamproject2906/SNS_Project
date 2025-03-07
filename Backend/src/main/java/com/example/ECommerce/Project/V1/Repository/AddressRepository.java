package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
}
