package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.RegisterRequest;
import com.example.ECommerce.Project.V1.Service.AuthenticationService.IAuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/Authentication")
@RequiredArgsConstructor
public class AuthenticationController {

    private final IAuthenticationService authenticationService;

    @PostMapping("/Register")
    public ResponseEntity<String> register(
           @RequestBody RegisterRequest request
    ){
        return authenticationService.register(request);
    }

    @PostMapping("/Authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/RefreshToken")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authenticationService.refreshToken(request, response);
    }

    @GetMapping("/register/verify")
    public AuthenticationResponse verifyEmail(
            @RequestParam("token") String token
    ) {
        return authenticationService.verifyEmail(token);
    }
}
