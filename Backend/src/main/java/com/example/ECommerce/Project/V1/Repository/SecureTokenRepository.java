package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Token.SecureToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecureTokenRepository extends JpaRepository<SecureToken, Long> {
    SecureToken findByToken(String token);
    void deleteByToken(String token);
}
