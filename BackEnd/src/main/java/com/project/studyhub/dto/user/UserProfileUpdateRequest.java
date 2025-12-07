package com.project.studyhub.dto.user;

import jakarta.validation.constraints.Size;

public record UserProfileUpdateRequest(
        @Size(min = 1, max = 15, message = "닉네임은 1~15자여야 합니다.")
        String nickname,
        @Size(max = 80, message = "소개는 80자 이하여야 합니다.")
        String description
) {
}
