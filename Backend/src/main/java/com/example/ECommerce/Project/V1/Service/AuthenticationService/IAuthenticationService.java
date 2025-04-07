package com.example.ECommerce.Project.V1.Service.AuthenticationService;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.RegisterRequest;
import com.example.ECommerce.Project.V1.Model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface IAuthenticationService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
    void saveUserToken(User savedUser, String jwtToken);
    void cleanUpExpiredTokens(User user);
    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
    void registerByGoogle(String jwt);
}
