package com.example.restea.oauth2.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TokenType {
    ACCESS("Authorization"),
    REFRESH("refresh");

    private final String type;
}
