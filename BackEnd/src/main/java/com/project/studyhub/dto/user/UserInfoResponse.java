package com.project.studyhub.dto.user;

import com.project.studyhub.entity.User;

public record UserInfoResponse(
        String email,
        String nickname,
        String address,
        String description,
        String role
) {
    public static UserInfoResponse from(User user) {
        return new UserInfoResponse(
                user.getEmail(),
                user.getNickname(),
                user.getAddress(),
                user.getDescription(),
                user.getRole().name()
        );
    }
}
