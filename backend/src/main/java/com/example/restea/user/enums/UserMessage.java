package com.example.restea.user.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserMessage {

    USER_NOT_FOUND("유저 정보가 없습니다."),
    USER_ALREADY_WITHDRAWN("이미 탈퇴한 유저입니다.");

    private final String message;
}
