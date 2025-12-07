package com.project.studyhub.service.user;

import com.project.studyhub.dto.user.*;
import com.project.studyhub.entity.User;
import com.project.studyhub.exception.AccessDeniedException;
import com.project.studyhub.exception.EmailExistsException;
import com.project.studyhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> signUp(UserSignUpRequest dto) {
        if(userRepository.existsByEmail(dto.email())) throw new EmailExistsException("이미 존재하는 Email 입니다.");
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate coordinate = new Coordinate(dto.longitude(), dto.latitude());
        Point point = geometryFactory.createPoint(coordinate);
        userRepository.save(new User(dto.email(), passwordEncoder.encode(dto.password()), dto.nickname(), dto.address(), point));
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<UserInfoResponse> getUserInfoByUserId(Long userId) {
        User user = findUserById(userId);
        return ResponseEntity.ok(UserInfoResponse.from(user));
    }
    public ResponseEntity<UserInfoResponse> getMyInfo(Principal principal) {
        User user = findUserByPrincipal(principal);
        return ResponseEntity.ok(UserInfoResponse.from(user));
    }
    @Transactional
    public void updateProfile(Principal principal, @Valid UserProfileUpdateRequest request) {
        User user = findUserByPrincipal(principal);
        user.changeInfo(request.nickname(), request.description());
    }
    @Transactional
    public void updateAddress(Principal principal, @Valid UserAddressUpdateRequest request) {
        User user = findUserByPrincipal(principal);
        user.changeAddress(request.address(), request.longitude(), request.latitude());
    }
    @Transactional
    public void changePassword(Principal principal, @Valid UserPasswordChangeRequest request) {
        User user = findUserByPrincipal(principal);
        if(!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("현재 비밀번호가 일치하지 않습니다.");
        }
        String encoded = passwordEncoder.encode(request.newPassword());
        user.changePassword(encoded);
    }

    // 헬퍼메세ㅓ드
    public User findUserByPrincipal(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(()->new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
    }
    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(()->new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
    }
}
