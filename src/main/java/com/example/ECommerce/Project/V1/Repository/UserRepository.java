package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
<<<<<<< HEAD
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(UUID id);
=======
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
>>>>>>> 56e0f75c34cd5454ea757a65827bd2379c78100c
}
