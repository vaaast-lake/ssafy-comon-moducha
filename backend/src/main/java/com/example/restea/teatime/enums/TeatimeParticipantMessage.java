package com.example.restea.teatime.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TeatimeParticipantMessage {
    TEATIME_PARTICIPANT_NOT_FOUND("Not a participant.");

    private final String message;
}
