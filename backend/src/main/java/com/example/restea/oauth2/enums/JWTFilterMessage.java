package com.example.restea.oauth2.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum JWTFilterMessage {
    EXPIRED_ACCESS_TOKEN("Access Token이 만료되었습니다.", "expired"),
    NO_ACCESS_TOKEN("Access Token이 아닙니다.", "invalid");


    private final String message;
    private final String code;

    public String toJson() {
        return String.format("{\"message\": \"%s\", \"code\": \"%s\"}", message, code);
    }
}