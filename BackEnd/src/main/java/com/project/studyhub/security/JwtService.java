package com.project.studyhub.security;

import com.project.studyhub.entity.User;
import com.project.studyhub.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtService {
    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-time}")
    private long expirationTime;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getToken(User user) { // 💡 인수를 CustomUserDetails 객체로 변경
        // 💡 1. 사용자 ID와 닉네임 클레임 추가
        return Jwts.builder()
                .claim("userId", user.getUserId())
                .claim("email", user.getEmail())
                .claim("nickname", user.getNickname())
                .claim("role", user.getRole())
                .subject(user.getUsername())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    public String getAuthUser(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (token != null) {
            // 토큰 파싱 및 서명 검증
            return Jwts.parser()
                    .verifyWith(getSigningKey()) // 서명 검증을 위해 동일한 키를 사용
                    .build()
                    .parseSignedClaims(token.replace("Bearer", "").trim()) // 'Bearer ' 접두사와 앞뒤 공백 제거
                    .getPayload()
                    .getSubject();
        }
        return null;
    }
}