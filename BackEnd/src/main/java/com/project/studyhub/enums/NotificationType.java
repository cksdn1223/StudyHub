package com.project.studyhub.enums;

/**
 * 알림의 종류를 나타내는 Enum.
 * JOIN_REQUEST 요청, REQUEST_ACCEPTED 수락, REQUEST_REJECTED 거절
 */
public enum NotificationType {
    JOIN_REQUEST,   // 스터디 참여 요청
    REQUEST_ACCEPTED, // 참여 요청 수락
    REQUEST_REJECTED  // 참여 요청 거절
}