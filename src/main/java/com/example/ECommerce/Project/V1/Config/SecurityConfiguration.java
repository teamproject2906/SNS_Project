package com.example.ECommerce.Project.V1.Config;

import com.example.ECommerce.Project.V1.Filter.JWTAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
// <<<<<<< DungLV
// import org.springframework.security.core.userdetails.User;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.provisioning.InMemoryUserDetailsManager;
// =======
// >>>>>>> main
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration implements AuthenticationProvider {

    private final JWTAuthenticationFilter jwtAuthenticationFilter;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
// <<<<<<< DungLV
//                                 "/login","/error",
// =======
// >>>>>>> main
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
// <<<<<<< DungLV
// //                .sessionManagement(session -> session
// //                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
// //                )
// =======
//                 .sessionManagement(session -> session
//                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                 )
// >>>>>>> main
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
// <<<<<<< DungLV
//                 )
//                 .formLogin(form -> form
//                         .loginPage("/login")
//                         .defaultSuccessUrl("/dashboard", true)
//                         .permitAll()
//                 )
//                 .oauth2Login(oauth2 -> oauth2
//                         .loginPage("/login")
//                         .defaultSuccessUrl("/dashboard", true)
//                 )
// //                .sessionManagement()
//                 ;
// =======
//                 );
// //                .formLogin(form -> form.loginPage("/Demo/Login").permitAll())
// //                .oauth2Login(oauth2 -> oauth2.loginPage("/Demo/Login"));
// >>>>>>> main
        return http.build();
    }


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
// <<<<<<< DungLV

// //    @Bean
// //    public UserDetailsService userDetailsService2() {
// //        UserDetails defaultUser = User.builder()
// //                .username("admin")
// //                .password(passwordEncoder2().encode("admin123"))
// //                .roles("ADMIN")
// //                .build();
// //
// //        return new InMemoryUserDetailsManager(defaultUser);
// //    }

// //    @Bean
// //    public PasswordEncoder passwordEncoder2() {
// //        return new BCryptPasswordEncoder();
// //    }
// =======
// >>>>>>> main
}
