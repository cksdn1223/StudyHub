package com.project.studyhub.service.user;

import com.project.studyhub.dto.user.UserInfoResponse;
import com.project.studyhub.dto.user.UserSignUpRequest;
import com.project.studyhub.entity.User;
import com.project.studyhub.exception.EmailExistsException;
import com.project.studyhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        User user = userRepository.findById(userId)
                .orElseThrow(()->new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        return ResponseEntity.ok(UserInfoResponse.from(user));
    }
}
