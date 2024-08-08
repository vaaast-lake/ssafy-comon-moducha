package com.example.restea.teatime.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TeatimeCommentMessage {
    TEATIME_COMMENT_NO_CONTENT("No TeatimeComment");

    private final String message;
}
