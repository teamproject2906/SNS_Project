package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.RegisterRequest;
import com.example.ECommerce.Project.V1.Service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/Authentication")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;


    @PostMapping("/Register")
    public ResponseEntity<AuthenticationResponse> register(
           @RequestBody RegisterRequest request
    ){
        return ResponseEntity.ok(authenticationService.register(request));
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

    @GetMapping("/google-login")
    public void googleLogin(HttpServletResponse response) throws IOException {
        // Redirect to Google's OAuth2 login URL (managed by Spring Security)
        response.sendRedirect("/oauth2/authorization/google");
    }
}
