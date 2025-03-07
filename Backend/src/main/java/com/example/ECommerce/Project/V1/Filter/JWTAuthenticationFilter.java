package com.example.ECommerce.Project.V1.Filter;

import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.TokenRepository;
import com.example.ECommerce.Project.V1.Service.JWTService;
import com.example.ECommerce.Project.V1.Token.Token;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authorizationHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {

            try {
                Jwt decodedJwt = jwtService.jwtDecoder.decode(jwt);
                String email = decodedJwt.getClaim("email");
                processOAuth2User(email, request);
                filterChain.doFilter(request, response);
                return;
            } catch (JwtException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Token is missing or invalid");
                response.getWriter().flush();
                return;
            }
        }

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
//        findTokenByUserID(request, userDetails, jwt);
        var tokenOptional = tokenRepository.findTokenByToken(jwt);

        if (tokenOptional.isPresent()) {
            Token token = tokenOptional.get();
            boolean isDatabaseTokenValid = !token.isExpired() && !token.isRevoked();
            if (jwtService.isTokenValid(jwt, userDetails) && isDatabaseTokenValid) {
                System.out.println("Authority: " + userDetails.getAuthorities());
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                System.out.println("Sau khi set Authentication: " + SecurityContextHolder.getContext().getAuthentication());

            } else {
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Token has been revoked or expired");
                response.getWriter().flush();
                return;
            }
        } else {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Token is missing or invalid");
            response.getWriter().flush();
            return;
        }
        filterChain.doFilter(request, response);
    }

    private void processOAuth2User(String email, HttpServletRequest request) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        System.out.println(userDetails.getUsername());
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    private void findTokenByUserID(HttpServletRequest request, UserDetails userDetails, String jwt) {
        User user = (User) userDetails;
        Integer userId = user.getId();
        var tokenOptional = tokenRepository.findById(userId);
        if (tokenOptional.isPresent()) {
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
    }
}

