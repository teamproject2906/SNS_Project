package com.example.ECommerce.Project.V1.Config;

import com.example.ECommerce.Project.V1.Filter.JWTAuthenticationFilter;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
<<<<<<< HEAD
=======
import jakarta.servlet.http.HttpServletResponse;
>>>>>>> main
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.authentication.JwtIssuerAuthenticationManagerResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
<<<<<<< HEAD
=======
import javax.crypto.spec.SecretKeySpec;
>>>>>>> main
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration implements AuthenticationProvider {

    @Value("${application.security.jwt.secret-key}") // Secret key cho HMAC
    private String secretKey;

    private final JWTAuthenticationFilter jwtAuthenticationFilter;
    private final LogoutHandler logoutHandler;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174", "http://localhost:5175"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder) throws Exception {
        JwtIssuerAuthenticationManagerResolver authenticationManagerResolver =
                new JwtIssuerAuthenticationManagerResolver(
                        issuer -> {
                            if ("https://accounts.google.com".equals(issuer)) {
                                return googleAuthenticationManager();
                            } else if ("http://localhost:8080".equals(issuer)) {
                                return internalAuthenticationManager();
                            } else {
                                throw new JwtException("Unknown issuer: " + issuer);
                            }
                        }
                );
        http
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "Google/**",
                                "/oauth2/**",
                                "/login",
                                "/Authentication/**",
                                "/v2/api-docs/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/configuration/ui",
                                "/configuration/security",
                                "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authenticationProvider(this)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                    .logoutUrl("/Authentication/Logout")
                    .addLogoutHandler(logoutHandler)
                    .logoutSuccessHandler(
                            (request, response, authentication) -> {
                                SecurityContextHolder.clearContext();
                            }
                    )
                 )
                 .formLogin(form -> form
                         .loginPage("/login")
                         .defaultSuccessUrl("/dashboard", true)
                         .permitAll()
                 )
                .oauth2ResourceServer(oauth2 -> oauth2.authenticationManagerResolver(authenticationManagerResolver));
//                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder)));
//                .oauth2Login(oauth2 -> oauth2
//                        .authorizationEndpoint(auth -> auth.baseUri("/oauth2/authorization"))
//                        .redirectionEndpoint(redir -> redir.baseUri("/login/oauth2/code/*"))
//                        .defaultSuccessUrl("/oauth2/GoogleLogin", true) // Redirects to API user info
//                        .failureUrl("/oauth2/LoginError") // Redirect on failure
//                )
//                .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
//                .sessionManagement();
        return http.build();
    }

    private AuthenticationManager googleAuthenticationManager() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();
        return new ProviderManager(new JwtAuthenticationProvider(jwtDecoder));
    }

    private AuthenticationManager internalAuthenticationManager() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        SecretKey hmacKey = Keys.hmacShaKeyFor(keyBytes);
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(hmacKey).build();
        return new ProviderManager(new JwtAuthenticationProvider(jwtDecoder));
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
