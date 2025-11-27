package com.project.studyhub.service.user;

import com.project.studyhub.dto.user.UserSignUpRequest;
import com.project.studyhub.entity.User;
import com.project.studyhub.exception.EmailExistsException;
import com.project.studyhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> signUp(UserSignUpRequest dto) {
        if(userRepository.existsByEmail(dto.email())) throw new EmailExistsException("이미 존재하는 Email 입니다.");
        userRepository.save(new User(dto.email(), passwordEncoder.encode(dto.password()), dto.nickname()));
        return ResponseEntity.ok().build();

    }
}
