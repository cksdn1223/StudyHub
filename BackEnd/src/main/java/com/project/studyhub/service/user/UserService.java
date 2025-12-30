package com.project.studyhub.service.user;

import com.project.studyhub.dto.user.*;
import com.project.studyhub.entity.User;
import com.project.studyhub.exception.EmailExistsException;
import com.project.studyhub.repository.UserRepository;
import com.project.studyhub.service.gcs.ProfileImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfileImageService profileImageService;

    public void signUp(UserSignUpRequest dto) {
        if(userRepository.existsByEmail(dto.email())) throw new EmailExistsException("이미 존재하는 Email 입니다.");
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate coordinate = new Coordinate(dto.longitude(), dto.latitude());
        Point point = geometryFactory.createPoint(coordinate);
        userRepository.save(new User(dto.email(), passwordEncoder.encode(dto.password()), dto.nickname(), dto.address(), point));
    }

    public UserInfoResponse getUserInfoByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()->new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        return UserInfoResponse.from(user);
    }

    @Transactional
    public void updateProfile(User user, @Valid UserProfileUpdateRequest request) {
        user = findUserById(user.getUserId());
        user.changeInfo(request.nickname(), request.description());
    }
    @Transactional
    public void updateAddress(User user, @Valid UserAddressUpdateRequest request) {
        user = findUserById(user.getUserId());
        user.changeAddress(request.address(), request.longitude(), request.latitude());
    }
    @Transactional
    public void changePassword(User user, @Valid UserPasswordChangeRequest request) {
        user = findUserById(user.getUserId());
        if(!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("현재 비밀번호가 일치하지 않습니다.");
        }
        String encoded = passwordEncoder.encode(request.newPassword());
        user.changePassword(encoded);
    }
    @Transactional
    public void changeProfileImage(User user, MultipartFile file) {
        user = findUserById(user.getUserId());
        String newUrl = profileImageService.uploadProfileImage(user.getUserId(), file);
        // 필요하면 기존 이미지 삭제 로직도 추가 (oldUrl 파싱 → GCS 삭제)
        user.changeUrl(newUrl);
    }


//    헬퍼메서드
    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(()->new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
    }
}
