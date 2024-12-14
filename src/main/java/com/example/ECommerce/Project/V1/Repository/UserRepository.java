package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}
