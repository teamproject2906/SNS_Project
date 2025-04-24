package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.RegisterRequest;
import com.example.ECommerce.Project.V1.DTO.ChangeForgotPasswordRequest;
import com.example.ECommerce.Project.V1.DTO.ResponseDTO.ResponseMessageAPI;
import com.example.ECommerce.Project.V1.Service.AuthenticationService.IAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/Authentication")
@RequiredArgsConstructor
public class AuthenticationController {

    private final IAuthenticationService authenticationService;

    @PostMapping("/Register")
    public ResponseEntity<String> register(
           @RequestBody RegisterRequest request,
           HttpServletRequest servletRequest,
           HttpServletResponse servletResponse
    ){
        return authenticationService.register(request, servletRequest, servletResponse);
    }

    @PostMapping("/Authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletRequest servletRequest
    ){
        return ResponseEntity.ok(authenticationService.authenticate(request, servletRequest));
    }

    @PostMapping("/RefreshToken")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authenticationService.refreshToken(request, response);
    }

    @PostMapping("/ForgotPassword/{email}")
    public ResponseEntity<String> forgotPassword(
            @PathVariable("email") String email,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse
    ) {
        return authenticationService.forgotPassword(email, servletRequest, servletResponse);
    }

    @PatchMapping("/changeForgotPassword")
    public ResponseMessageAPI changeForgotPassword(
            @RequestBody ChangeForgotPasswordRequest request,
            HttpServletRequest servletRequest,
            Principal connectedUser
    ) throws BadRequestException {
        authenticationService.changeForgotPassword(request, servletRequest);
        return ResponseMessageAPI.builder()
                .message("Change password successfully")
                .status(HttpStatus.OK)
                .success(true)
                .build();
    }

    @GetMapping("/register/verify")
    public AuthenticationResponse verifyEmail(
            @RequestParam("token") String token,
            HttpServletRequest servletRequest
    ) {
        return authenticationService.verifyEmail(token, servletRequest);
    }
}
