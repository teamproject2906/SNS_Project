package com.example.ECommerce.Project.V1.Service.AuthenticationService;

import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationRequest;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.AuthenticationResponse;
import com.example.ECommerce.Project.V1.DTO.AuthenticationDTO.RegisterRequest;
import com.example.ECommerce.Project.V1.DTO.ChangeForgotPasswordRequest;
import com.example.ECommerce.Project.V1.DTO.UserDTO;
import com.example.ECommerce.Project.V1.Mailing.AccountVerificationEmailContext;
import com.example.ECommerce.Project.V1.Mailing.EmailService;
import com.example.ECommerce.Project.V1.Model.AuditLog;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.AuditLogRepository;
import com.example.ECommerce.Project.V1.Repository.TokenRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import com.example.ECommerce.Project.V1.Service.CartService.ICartService;
import com.example.ECommerce.Project.V1.Service.JWTService;
import com.example.ECommerce.Project.V1.Service.SecureTokenService.ISecureTokenService;
import com.example.ECommerce.Project.V1.Token.SecureToken;
import com.example.ECommerce.Project.V1.Token.Token;
import com.example.ECommerce.Project.V1.Token.TokenType;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
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

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9_]{3,20}$");
    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    private ModelMapper mapper;

    @Override
    public ResponseEntity<String> register(RegisterRequest request, HttpServletRequest servletRequest, HttpServletResponse servletResponse) {

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
                .isVerified(false)
                .isActive(true)
                .build();
        var savedUser = userRepository.save(user); // Save user in DB
        cartService.initializeCartForUser(savedUser.getId());

        // Generate secure token
        var secureToken = secureTokenService.createToken();
        secureToken.setUser(savedUser);
        secureTokenService.saveSecureToken(secureToken);

//        Cookie emailToken = new Cookie("emailToken", secureToken.getToken());
//        emailToken.setHttpOnly(false);
//        emailToken.setSecure(false);
//        emailToken.setPath("/");
//        emailToken.setMaxAge(3600);
//        emailToken.setAttribute("SameSite", "Lax");
//        servletResponse.addCookie(emailToken);

        String cookie = String.format("emailTokenForGG=%s; Max-Age=3600; Path=/; SameSite=Lax", secureToken.getToken());
        servletResponse.setHeader("Set-Cookie", cookie);

        // Prepare and send verification email
        AccountVerificationEmailContext emailContext = new AccountVerificationEmailContext();
        emailContext.init(savedUser);
        emailContext.setToken(secureToken.getToken());

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
            throw new IllegalArgumentException("Invalid username. Only alphanumeric characters and underscores are allowed (3-20 characters).");
        }

        if (!EMAIL_PATTERN.matcher(request.getEmailOrPhoneNumber()).matches()) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        if (request.getPassword().length() < 8 || request.getPassword().length() > 50) {
            throw new IllegalArgumentException("Password must be between 8 and 50 characters");
        }
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletRequest servletRequest) {

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
            throw new IllegalArgumentException("Username and password not correct!");
        }

        // Extract IP address from the request
        String ipAddress = servletRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = servletRequest.getRemoteAddr();
        }

        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .tableName("Authentication")
                .actionType("LOGIN")
                .actionTime(LocalDateTime.now())
                .ipAddress(ipAddress).build();
        auditLogRepository.save(auditLog);

        var jwtToken = jwtService.generateToken(user, ipAddress);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserToken(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .user(mapper.map(user, UserDTO.class))
                .build();
    }

    @Override
    public AuthenticationResponse verifyEmail(String token, HttpServletRequest servletRequest) {

        SecureToken secureToken = secureTokenService.findByToken(token);

        if (secureToken == null || secureToken.isExpired()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token.");
        }

        User user = secureToken.getUser();
        user.setIsVerified(true);
        var savedUser = userRepository.save(user);
        secureTokenService.removeToken(secureToken);

        // Extract IP address from the request
        String ipAddress = servletRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = servletRequest.getRemoteAddr();
        }

        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .tableName("Authentication")
                .actionType("REGISTER")
                .actionTime(LocalDateTime.now())
                .ipAddress(ipAddress).build();
        auditLogRepository.save(auditLog);

        var jwtToken = jwtService.generateToken(user, ipAddress);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(savedUser.getRole())
                .build();
    }

    @Override
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

    @Override
    public void cleanUpExpiredTokens(User user) {
        tokenRepository.deleteExpiredAndRevokedTokensByUserId(user.getId());
    }

    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String username;

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return;
        }

        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }

        refreshToken = authorizationHeader.substring(7);
        username = jwtService.extractUsername(refreshToken);
        if (username != null) {
            var userDetails = this.userRepository.findByUsername(username).orElseThrow();
            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                var accessToken = jwtService.generateToken(userDetails, ipAddress);
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

    @Override
    public void registerByGoogle(String jwt, HttpServletRequest servletRequest) {
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

            String ipAddress = servletRequest.getHeader("X-Forwarded-For");
            if (ipAddress == null || ipAddress.isEmpty()) {
                ipAddress = servletRequest.getRemoteAddr();
            }

            AuditLog auditLog = AuditLog.builder()
                    .user(user)
                    .tableName("Authentication")
                    .actionType("LOGIN GOOGLE")
                    .actionTime(LocalDateTime.now())
                    .ipAddress(ipAddress).build();
            auditLogRepository.save(auditLog);

            saveUserToken(savedUser, jwt);
        } else {
            saveUserToken(userEmail, jwt);
        }
    }

    @Override
    public void changeForgotPassword(ChangeForgotPasswordRequest request, HttpServletRequest servletRequest) throws BadRequestException {

        // Validate OTP
//        HttpSession session = servletRequest.getSession(false);
//        if (session == null) {
//            throw new BadRequestException("Session expired or not found.");
//        }

//        Object savedOtp = session.getAttribute("otp_" + request.getEmail());
//        if (savedOtp == null || !savedOtp.toString().equals(request.getOtp())) {
//            throw new BadRequestException("Invalid or expired OTP!");
//        }
        System.out.println("luc nhap" + servletRequest.getSession().getId());

        String sessionOtp = (String) servletRequest.getSession().getAttribute("code_forgot");
        if (!request.getOtp().equals(sessionOtp)) {
            throw new BadRequestException("Invalid OTP!");
        }

        // Validate password
        if (request.getNewPassword().length() < 8 || request.getNewPassword().length() > 50) {
            throw new IllegalArgumentException("Password must be between 8 and 50 characters.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadCredentialsException("Passwords and Confirm Password do not match.");
        }

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new BadRequestException("No user found with the provided email.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Clear OTP from session
//        session.removeAttribute("otp_" + request.getEmail());
    }

    @Override
    public ResponseEntity<String> forgotPassword(String email, HttpServletRequest servletRequest, HttpServletResponse servletResponse) {

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format.");
        }

        User savedUser = userRepository.findByEmail(email);
        if (savedUser == null) {
            throw new IllegalArgumentException("Email not found.");
        }

        // 1. Generate 6-digit OTP
        int otp = 100000 + new Random().nextInt(900000); // 100000 -> 999999

        // 2. Store OTP in session
//        HttpSession session = servletRequest.getSession(true);
//        session.setAttribute("otp_" + email, otp);
//        session.setMaxInactiveInterval(10 * 60); // 10 minutes

        // 3. Send email
        String subject = "Your Password Reset Code";
        emailService.sendOtp(email, subject, otp);
        servletRequest.getSession().setAttribute("code_forgot", String.valueOf(otp));
        System.out.println("luc nhap" + servletRequest.getSession().getId());

        return ResponseEntity.ok("An OTP has been sent to your email. Please check your inbox.");
    }


//    @Override
//    public ResponseEntity<String> forgotPassword(String email, HttpServletRequest servletRequest, HttpServletResponse servletResponse){
//
//        if (!EMAIL_PATTERN.matcher(email).matches()) {
//            throw new IllegalArgumentException("Invalid email format.");
//        }
//
//        User savedUser = userRepository.findByEmail(email);
//        var secureToken = secureTokenService.createToken();
//        secureToken.setUser(savedUser);
//        secureTokenService.saveSecureToken(secureToken);
//
//        // Prepare and send verification email
//        AccountVerificationEmailContext emailContext = new AccountVerificationEmailContext();
//        emailContext.init(savedUser);
//        emailContext.setToken(secureToken.getToken());
//
////        Cookie emailToken = new Cookie("emailToken", secureToken.getToken());
////        emailToken.setHttpOnly(false);
////        emailToken.setSecure(false);
////        emailToken.setPath("/");
////        emailToken.setMaxAge(3600);
////        emailToken.setAttribute("SameSite", "Lax");
////        response.addCookie(emailToken);
//
////        String cookie = String.format("emailTokenForGG=%s; Max-Age=3600; Path=/; SameSite=Lax", secureToken.getToken());
////        servletResponse.setHeader("Set-Cookie", cookie);
//
////        String baseUrl = "http://localhost:5173";
////        emailContext.buildVerificationUrl(baseUrl, secureToken.getToken());
//
//        try {
//            emailService.sendMail(emailContext);
//            return ResponseEntity.ok("We have send to your email a verification, please check have a check and complete your registration!");
//        } catch (MessagingException e) {
//            throw new RuntimeException("Failed to send verification email", e);
//        }
//    }
}
