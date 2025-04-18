package com.example.ECommerce.Project.V1.Service.AuthenticationService;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.RegisterRequest;
import com.example.ECommerce.Project.V1.Exception.ResourceNotFoundException;
import com.example.ECommerce.Project.V1.Mailing.AccountVerificationEmailContext;
import com.example.ECommerce.Project.V1.Mailing.EmailService;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.TokenRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import com.example.ECommerce.Project.V1.Service.CartService.ICartService;
import com.example.ECommerce.Project.V1.Service.JWTService;
import com.example.ECommerce.Project.V1.Service.SecureTokenService.ISecureTokenService;
import com.example.ECommerce.Project.V1.Service.WishlistService.WishlistService;
import com.example.ECommerce.Project.V1.Token.SecureToken;
import com.example.ECommerce.Project.V1.Token.Token;
import com.example.ECommerce.Project.V1.Token.TokenType;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements IAuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final ISecureTokenService secureTokenService;
    @Autowired
    private ICartService cartService;

    @Autowired
    private WishlistService wishlistService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9_]{3,50}$");

    // 2. Handle the business logic code for registration
    public ResponseEntity<String> register(RegisterRequest request, HttpServletResponse servletResponse) {

        validateRequestRegister(request);

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmailOrPhoneNumber().contains("@")?request.getEmailOrPhoneNumber():null)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .createdBy("SYSTEM")
                .updatedBy("SYSTEM")
                .isVerified(true)
                .isActive(true)
                .build();
        var savedUser = userRepository.save(user); // Save user in DB
        cartService.initializeCartForUser(savedUser.getId());
        wishlistService.createWishlist(savedUser.getId());

        // Generate secure token
        var secureToken = secureTokenService.createToken();
        secureToken.setUser(savedUser);
        secureTokenService.saveSecureToken(secureToken);

        // Prepare and send verification email
        AccountVerificationEmailContext emailContext = new AccountVerificationEmailContext();
        emailContext.init(savedUser);
        emailContext.setToken(secureToken.getToken());

//        Cookie emailToken = new Cookie("emailToken", secureToken.getToken());
//        emailToken.setHttpOnly(false);
//        emailToken.setSecure(false);
//        emailToken.setPath("/");
//        emailToken.setMaxAge(3600);
//        emailToken.setAttribute("SameSite", "Lax");
//        servletResponse.addCookie(emailToken);

        String cookie = String.format("emailTokenForGG=%s; Max-Age=3600; Path=/; SameSite=Lax", secureToken.getToken());
        servletResponse.setHeader("Set-Cookie", cookie);

//        String baseUrl = "http://localhost:8080/Authentication"; // hoặc lấy từ HttpServletRequest nếu muốn động
        String baseUrl = "http://localhost:5173";
        emailContext.buildVerificationUrl(baseUrl, secureToken.getToken());

        try {
            emailService.sendMail(emailContext);
            return ResponseEntity.ok("We have send to your email a verification, please check have a check and complete your registration!");
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private void validateRequestRegister(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (request.getEmailOrPhoneNumber().contains("@")) {
            if (userRepository.findByEmail(request.getEmailOrPhoneNumber()) != null ) {
                throw new IllegalArgumentException("Email already exists");
            }
        } else {
            if (userRepository.findByPhoneNumber(request.getEmailOrPhoneNumber()).isPresent()) {
                throw new IllegalArgumentException("Phone number already exists");
            }
        }

        if (!USERNAME_PATTERN.matcher(request.getUsername()).matches()) {
            throw new IllegalArgumentException("Invalid username. Only alphanumeric characters and underscores are allowed (3-50 characters).");
        }

        if (!EMAIL_PATTERN.matcher(request.getEmailOrPhoneNumber()).matches()) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        if (request.getPassword().length() < 8 || request.getPassword().length() > 50) {
            throw new IllegalArgumentException("Password must be between 8 and 50 characters");
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Username not exist!"));

        if (!user.getIsActive()) {
            throw new DisabledException("Your account is banned");
        }

        if (!user.getIsVerified()) {
            throw new DisabledException("Your account is not verified");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Password not correct!");
        }

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserToken(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .build();
    }

    public AuthenticationResponse verifyEmail(String token) {

        SecureToken secureToken = secureTokenService.findByToken(token);

        if (secureToken == null || secureToken.isExpired()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token.");
        }

        User user = secureToken.getUser();
        user.setIsVerified(true);
        var savedUser = userRepository.save(user);
        secureTokenService.removeToken(secureToken);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(savedUser.getRole())
                .build();
    }

    public void saveUserToken(User savedUser, String jwtToken) {
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
                        .role(userDetails.getRole())
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

    @Override
    public ResponseEntity<String> forgotPassword(String email, HttpServletResponse response) {

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        var savedUser = userRepository.findByEmail(email);
        if (savedUser != null) {
            // Generate secure token
            var secureToken = secureTokenService.createToken();
            secureToken.setUser(savedUser);
            secureTokenService.saveSecureToken(secureToken);

            // Prepare and send verification email
            AccountVerificationEmailContext emailContext = new AccountVerificationEmailContext();
            emailContext.init(savedUser);
            emailContext.setToken(secureToken.getToken());

//            Cookie emailToken = new Cookie("emailToken", secureToken.getToken());
//            emailToken.setHttpOnly(false);
//            emailToken.setSecure(false);
//            emailToken.setPath("/");
//            emailToken.setMaxAge(3600);
//            emailToken.setAttribute("SameSite", "Lax");
//            response.addCookie(emailToken);
            String cookie = String.format("emailTokenForForgot=%s; Max-Age=3600; Path=/; SameSite=Lax", secureToken.getToken());
            response.setHeader("Set-Cookie", cookie);

//          String baseUrl = "http://localhost:8080/Authentication"; // hoặc lấy từ HttpServletRequest nếu muốn động
            String baseUrl = "http://localhost:5173";
            emailContext.buildVerificationUrlForgotPass(baseUrl, secureToken.getToken());

            try {
                emailService.sendMail(emailContext);
                return ResponseEntity.ok("We have send to your email a verification, please check have a check and complete your forgot password session!");
            } catch (MessagingException e) {
                throw new RuntimeException("Failed to send verification email", e);
            }
        } else {
            throw new ResourceNotFoundException("Account not found with given email.");
        }
    }
}