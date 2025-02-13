package com.example.ECommerce.Project.V1.Filter;

import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.TokenRepository;
import com.example.ECommerce.Project.V1.Service.JWTService;
import com.example.ECommerce.Project.V1.Token.Token;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;
    private final UserDetailsService userDetailsService;
    @Autowired
    private TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authorizationHeader.substring(7);
        username = jwtService.extractUsername(jwt);

        if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Token is missing or invalid");
            response.getWriter().flush();
            return;
        }

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
        findTokenByUserID(request, userDetails, jwt);
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
            }else{
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Token has been revoked or expired");
                response.getWriter().flush();
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private void findTokenByUserID(HttpServletRequest request, UserDetails userDetails, String jwt) {
        User user = (User) userDetails;
        Integer userId = user.getId();
        var tokenOptional = tokenRepository.findTokenByUserId(userId);
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
