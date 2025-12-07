package com.project.studyhub.controller.user;

import com.project.studyhub.dto.user.UserAddressUpdateRequest;
import com.project.studyhub.dto.user.UserInfoResponse;
import com.project.studyhub.dto.user.UserPasswordChangeRequest;
import com.project.studyhub.dto.user.UserProfileUpdateRequest;
import com.project.studyhub.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfoResponse> getUserInfoByUserId(@PathVariable Long userId) {
        return userService.getUserInfoByUserId(userId);
    }
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getMyInfo(Principal principal) {
        return userService.getMyInfo(principal);
    }

    @PatchMapping("/info")
    public ResponseEntity<Void> updateProfile(
            Principal principal,
            @RequestBody @Valid UserProfileUpdateRequest request
            ) {
        userService.updateProfile(principal, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/address")
    public ResponseEntity<Void> updateAddress(
            Principal principal,
            @RequestBody @Valid UserAddressUpdateRequest request
    ) {
        userService.updateAddress(principal, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            Principal principal,
            @RequestBody @Valid UserPasswordChangeRequest request
    ) {
        userService.changePassword(principal, request);
        return ResponseEntity.noContent().build();
    }
}
