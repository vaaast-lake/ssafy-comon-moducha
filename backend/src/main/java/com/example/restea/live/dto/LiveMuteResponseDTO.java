package com.example.restea.live.dto;

import lombok.Builder;

public class LiveMuteResponseDTO {
    private Integer userId;
    private String trackSid;

    @Builder
    public LiveMuteResponseDTO(Integer userId, String trackSid) {
        this.userId = userId;
        this.trackSid = trackSid;
    }
}
