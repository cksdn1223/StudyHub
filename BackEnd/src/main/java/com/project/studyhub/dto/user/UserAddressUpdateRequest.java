package com.project.studyhub.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserAddressUpdateRequest(
        @NotBlank(message = "주소는 비어 있을 수 없습니다.")
        String address,
        @NotNull(message = "경도는 필수입니다.")
        Double longitude,
        @NotNull(message = "위도는 필수입니다.")
        Double latitude
) {
}
