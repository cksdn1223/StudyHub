package com.project.studyhub.dto.user;

import com.project.studyhub.entity.User;

public record UserInfoResponse(
        Long id,
        String email,
        String nickname,
        String address,
        String description,
        String role,
        String profileImageUrl
) {
    public static UserInfoResponse from(User user) {
        return new UserInfoResponse(
                user.getUserId(),
                user.getEmail(),
                user.getNickname(),
                user.getAddress(),
                user.getDescription(),
                user.getRole().name(),
                user.getProfileImageUrl()
        );
    }
}
