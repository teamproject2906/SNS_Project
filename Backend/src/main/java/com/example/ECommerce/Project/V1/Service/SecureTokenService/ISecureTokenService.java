package com.example.ECommerce.Project.V1.Service.SecureTokenService;

import com.example.ECommerce.Project.V1.Token.SecureToken;

public interface ISecureTokenService {
    SecureToken createToken();
    void saveSecureToken(SecureToken secureToken);
    SecureToken findByToken(String token);
    void removeToken(SecureToken token);
}
