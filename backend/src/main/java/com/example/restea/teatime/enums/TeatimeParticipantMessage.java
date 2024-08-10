package com.example.restea.teatime.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TeatimeParticipantMessage {
    TEATIME_PARTICIPANT_NOT_FOUND("Not a participant."),
    TEATIME_PARTICIPANT_ALREADY_EXISTS("Already exists."),
    TEATIME_PARTICIPANT_FULL("참가 인원이 초과되었습니다.");

    private final String message;
}
