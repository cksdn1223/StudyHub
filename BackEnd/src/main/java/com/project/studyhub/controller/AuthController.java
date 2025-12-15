package com.project.studyhub.controller;

import com.project.studyhub.dto.login.LoginRequest;
import com.project.studyhub.dto.user.UserSignUpRequest;
import com.project.studyhub.entity.User;
import com.project.studyhub.repository.UserRepository;
import com.project.studyhub.security.JwtService;
import com.project.studyhub.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest lr) {
        try {
            UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(lr.email(), lr.password());

            Authentication auth = authenticationManager.authenticate(creds);

            // 인증된 이메일로 User 조회
            String email = auth.getName(); // 일반적으로 username(email) 이 들어있음
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            String jwt = jwtService.getToken(user);

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt)
                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
                    .build();
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("로그인에 실패했습니다.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> signUp(@RequestBody UserSignUpRequest dto) {
        userService.signUp(dto);
        return ResponseEntity.ok().build();
    }
}