package com.example.restea.teatime.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TeatimeBoardMessage {
    TEATIMEBOARD_NOT_FOUND("TeatimeBoard not found."),
    TEATIMEBOARD_NOT_ACTIVATED("TeatimeBoard not activated."),
    TEATIMEBOARD_NOT_WRITER("Not a writer."),
    TEATIMEBOARD_NOT_BROADCAST_DATE("Different from the broadcast date."),
    TEATIMEBOARD_BEFORE_BROADCAST_DATE("Before the broadcast date.");

    private final String message;
}