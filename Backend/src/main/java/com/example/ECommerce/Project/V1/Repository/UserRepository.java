package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Model.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    User findByEmail(String email);
//    Page<User> findByUsernameContainingPage(String keyword, Pageable pageable);
    List<User> findByUsernameContaining(String keyword);
}
