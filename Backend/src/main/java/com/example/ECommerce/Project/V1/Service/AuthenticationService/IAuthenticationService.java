package com.example.ECommerce.Project.V1.Service.AuthenticationService;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.RegisterRequest;
import com.example.ECommerce.Project.V1.DTO.ChangeForgotPasswordRequest;
import com.example.ECommerce.Project.V1.Model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface IAuthenticationService {

    ResponseEntity<String> register(RegisterRequest request, HttpServletRequest servletRequest, HttpServletResponse servletResponse);

    AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletRequest servletRequest);

    AuthenticationResponse verifyEmail(String token, HttpServletRequest servletRequest);

    void saveUserToken(User savedUser, String jwtToken);

    void cleanUpExpiredTokens(User user);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;

    void registerByGoogle(String jwt, HttpServletRequest servletRequest);

    void changeForgotPassword(ChangeForgotPasswordRequest request, HttpServletRequest servletRequest) throws BadRequestException;

    ResponseEntity<String> forgotPassword(String email, HttpServletRequest request, HttpServletResponse response);
}
