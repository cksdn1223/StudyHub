package com.project.studyhub.dto.study;

public record StudyResponse(String title, String description, Integer maxMembers, Integer memberCount, String frequency, String duration, String address, String detailAddress, String detailLocation, double longitude, double latitude) {

}
