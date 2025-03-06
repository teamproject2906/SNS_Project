package com.example.ECommerce.Project.V1.Service;

import com.example.ECommerce.Project.V1.DTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.RegisterRequest;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.TokenRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import com.example.ECommerce.Project.V1.Token.Token;
import com.example.ECommerce.Project.V1.Token.TokenType;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;

    // 2. Handle the business logic code for registration
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmailOrPhoneNumber().contains("@")?request.getEmailOrPhoneNumber():null)
                .phoneNumber(!request.getEmailOrPhoneNumber().contains("@")?request.getEmailOrPhoneNumber():null)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .createdBy("SYSTEM")
                .updatedBy("SYSTEM")
                .isActive(true)
                .build();
        var savedUser = userRepository.save(user); // Save user in DB
        var jwtToken = jwtService.generateToken(user); // 4. Generates a new JWT for new user
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder() // 5. Return the token in the response
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    // 9. Validates the user's credentials (thông tin đăng nhập) and generates a JWT if successful.
    // Next, start with the JWTAuthenticationFilter
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserToken(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(User savedUser, String jwtToken) {
        var token = Token.builder()
                .user(savedUser)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    protected void revokeAllUserToken(User user) {
        var validUserTokens = tokenRepository.findAllTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return;
        }
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void cleanUpExpiredTokens(User user) {
        tokenRepository.deleteExpiredAndRevokedTokensByUserId(user.getId());
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String username;

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return;
        }

        refreshToken = authorizationHeader.substring(7);
        username = jwtService.extractUsername(refreshToken);
        if (username != null) {
            var userDetails = this.userRepository.findByUsername(username).orElseThrow();
            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                var accessToken = jwtService.generateToken(userDetails);
                revokeAllUserToken(userDetails);
                saveUserToken(userDetails, accessToken);
                var authenticateResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authenticateResponse);
            }
        }
    }

    public void registerByGoogle(String jwt) {
        Jwt decodedJwt = jwtService.jwtDecoder.decode(jwt);
        String email = decodedJwt.getClaim("email");
        var userEmail = userRepository.findByEmail(email);
        if(userEmail == null) {
            var user = User.builder()
                    .firstname(decodedJwt.getClaim("given_name"))
                    .lastname(decodedJwt.getClaim("family_name"))
                    .username(decodedJwt.getClaim("email"))
                    .email(decodedJwt.getClaim("email"))
                    .avatar(decodedJwt.getClaim("picture"))
                    .provider("GOOGLE")
                    .role(Role.USER)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .createdBy("SYSTEM")
                    .updatedBy("SYSTEM")
                    .isActive(true)
                    .build();
            var savedUser = userRepository.save(user);
            saveUserToken(savedUser, jwt);
        } else {
            saveUserToken(userEmail, jwt);
        }
    }
}
