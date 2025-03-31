package com.example.ECommerce.Project.V1.Controller;

import com.example.ECommerce.Project.V1.Service.AuthenticationService;
import com.example.ECommerce.Project.V1.Service.JWTService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/oauth2")
@RequiredArgsConstructor
public class GoogleController {

    private final AuthenticationService authenticationService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.provider.google.token-uri}")
    private String TOKEN_URI;

    @Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
    private String USER_INFO_URL;

    private static final String redirectUri = "http://localhost:8080/oauth2/callback";

    @GetMapping("/redirectToGoogle")
    public ResponseEntity<?> redirectToGoogle() {
        String scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
        String state = UUID.randomUUID().toString(); // Optional CSRF protection

        String authUrl = String.format(
                "https://accounts.google.com/o/oauth2/v2/auth?" +
                "scope=%s&" + "access_type=offline&" + "include_granted_scopes=true&" + "response_type=code&" +
                "state=%s&" + "redirect_uri=%s&" + "client_id=%s&" + "prompt=consent",
                URLEncoder.encode(scope, StandardCharsets.UTF_8), state,
                URLEncoder.encode(redirectUri, StandardCharsets.UTF_8), googleClientId
        );

        return ResponseEntity.ok(Map.of("auth_url", authUrl));
    }

    @GetMapping("/callback")
    public ResponseEntity<?> handleGoogleCallback(
            @RequestParam(value = "code", required = false) String authCode,
            @RequestParam(value = "error", required = false) String error
    ) {
        if (error != null) {
            return ResponseEntity.badRequest().body("Google login failed: " + error);
        }
        if (authCode == null || authCode.isEmpty()) {
            return ResponseEntity.badRequest().body("Authorization code is missing!");
        }
        return ResponseEntity.ok(Map.of("auth_code", authCode));
    }

    @PostMapping(value = "/getAccessToken", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> getAccessToken(@RequestParam("code") String code) {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", googleClientId);
        requestBody.add("client_secret", googleClientSecret);
        requestBody.add("code", code);
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("redirect_uri", redirectUri);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(TOKEN_URI, HttpMethod.POST, request, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            String jwt = jsonResponse.has("id_token") ? jsonResponse.get("id_token").asText() : "No access token found";

//            authenticationService.registerByGoogle(jwt);
            System.out.println(response.getBody());
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error retrieving access token: " + e.getMessage());
        }
    }

    @PostMapping(value = "/refreshToken", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> refreshToken(@RequestParam("refresh_token") String refreshToken) {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", googleClientId);
        requestBody.add("client_secret", googleClientSecret);
        requestBody.add("refresh_token", refreshToken);
        requestBody.add("grant_type", "refresh_token");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(TOKEN_URI, HttpMethod.POST, request, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            String jwt = jsonResponse.has("id_token") ? jsonResponse.get("id_token").asText() : "No access token found";

//            authenticationService.registerByGoogle(jwt);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error retrieving access token: " + e.getMessage());
        }
    }
}
