package com.project.studyhub.dto.user;

public record UserSignUpRequest (String nickname, String email, String password, String address, double longitude, double latitude){
}