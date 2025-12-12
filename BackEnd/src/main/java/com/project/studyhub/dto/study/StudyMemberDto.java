package com.project.studyhub.dto.study;

import com.project.studyhub.enums.ParticipantStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudyMemberDto {
    private Long userId;
    private String nickname;      // User 엔티티에 맞게 필드명 수정
    private String profileImageUrl;
    private String email;         // 필요 없으면 제거해도 됨
    private boolean leader;       // 리더 여부
    private ParticipantStatus status; // 참여자의 상태 (리더면 null 가능)
}