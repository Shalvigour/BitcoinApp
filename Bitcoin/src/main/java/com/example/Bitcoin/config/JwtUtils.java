package com.example.Bitcoin.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    // 1. Secret Key: Yeh aapki "Tijori ki chabi" hai.
    // Iske bina koi token nahi bana sakta.
    private final String jwtSecret = "TaK+HaV^uvCHEFsEVfypW#7g9^k*Z8$V";

    // 2. Expiration Time: Token kitni der tak valid rahega? (e.g., 24 hours)
    private final int jwtExpirationMs = 86400000;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Function A: Generate Token (Login ke waqt use hoga)
    public String generateToken(String emailId) {
        return Jwts.builder()
                .setSubject(emailId) // Token ke andar email daal rahe hain
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Chabi se sign kar rahe hain
                .compact();
    }

    // Function B: Get Email From Token (Har request ke waqt pta lagane ke liye kaun hai)
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Function C: Validate Token (Check karne ke liye ki token asli hai ya expired)
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}
