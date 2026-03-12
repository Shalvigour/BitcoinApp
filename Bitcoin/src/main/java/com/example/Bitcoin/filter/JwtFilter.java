package com.example.Bitcoin.filter;

import com.example.Bitcoin.config.JwtUtils; // Aapki JwtUtil class
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // 1. Header se 'Authorization' uthao
        String authorizationHeader = request.getHeader("Authorization");
        String emailId = null;
        String jwt = null;

        // 2. Check karo ki Header "Bearer " se start ho raha hai ya nahi
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // "Bearer " ke baad wali string (token)
            emailId = jwtUtil.getEmailFromToken(jwt);
        }

        // 3. Agar username mil gaya aur user pehle se authenticated nahi hai
        if (emailId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(emailId);

            // 4. Token validate karo
            if (jwtUtil.validateToken(jwt)) {
                // 5. Spring Security ko batao ki ye user valid hai
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext mein 'Authentication' set karna hi "Login" mana jata hai
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // 6. Request ko aage bhej do (Controller ki taraf)
        chain.doFilter(request, response);
    }
}
