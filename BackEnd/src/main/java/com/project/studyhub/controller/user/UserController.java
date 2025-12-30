package com.project.studyhub.controller.user;

import com.project.studyhub.dto.user.UserAddressUpdateRequest;
import com.project.studyhub.dto.user.UserInfoResponse;
import com.project.studyhub.dto.user.UserPasswordChangeRequest;
import com.project.studyhub.dto.user.UserProfileUpdateRequest;
import com.project.studyhub.entity.User;
import com.project.studyhub.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfoResponse> getUserInfoByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserInfoByUserId(userId));
    }
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getMyInfo(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserInfoResponse.from(user));
    }

    @PatchMapping("/info")
    public ResponseEntity<Void> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UserProfileUpdateRequest request
            ) {
        userService.updateProfile(user, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/address")
    public ResponseEntity<Void> updateAddress(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UserAddressUpdateRequest request
    ) {
        userService.updateAddress(user, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UserPasswordChangeRequest request
    ) {
        userService.changePassword(user, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/profile-image")
    public ResponseEntity<Void> changeProfileImage(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file
    ){
        userService.changeProfileImage(user, file);
        return ResponseEntity.noContent().build();
    }
}
