package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.DTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.RegisterRequest;
import com.example.ECommerce.Project.V1.Service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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

//    @GetMapping("/GoogleLogin")
//    public Map<String, String> getUserInfo(@AuthenticationPrincipal Jwt jwt) {
//        Map<String, String> userInfo = new HashMap<>();
//        userInfo.put("email", jwt.getClaim("email"));
//        userInfo.put("name", jwt.getClaim("name"));
//        return userInfo;
//    }
//    public void googleLogin(HttpServletResponse response) throws IOException {
//        // Redirect to Google's OAuth2 login URL (managed by Spring Security)
//        response.sendRedirect("/oauth2/authorization/google");
//    }
}
