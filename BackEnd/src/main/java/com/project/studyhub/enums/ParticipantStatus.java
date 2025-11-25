package com.project.studyhub.enums;

/**
 * 스터디 참여 신청 상태를 나타내는 Enum.
 * PENDING 대기, ACCEPTED 승인, REJECTED 거절
 */
public enum ParticipantStatus {
    PENDING,  // 승인 대기
    ACCEPTED, // 참여 승인
    REJECTED  // 참여 거절
}