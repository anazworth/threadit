package com.anazworth.authservice.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import com.anazworth.authservice.user.User;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    // @Value annotation is not working for this class
    private String jwtSecret = "thisismydogcurryssecretkeywhydoesitneedtobesolong";
    
    private int jwtExpirationMs = 86400000;
    
    private String jwtCookie = "jwtCookie";
    
    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(key(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public ResponseCookie generateJwtCookie(User user) {
        String jwt = generateToken(user.getUsername());
        return ResponseCookie.from(jwtCookie, jwt)
            .httpOnly(true)
            .maxAge(jwtExpirationMs)
            .path("/")
            .build();
    }
    
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
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
