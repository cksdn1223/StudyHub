package com.project.studyhub.controller.user;

import com.project.studyhub.dto.user.UserInfoResponse;
import com.project.studyhub.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfoResponse> getUserInfoByUserId(@PathVariable Long userId) {
        return userService.getUserInfoByUserId(userId);
    }
}
