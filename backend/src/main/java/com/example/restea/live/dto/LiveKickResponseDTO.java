package com.example.restea.live.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class LiveKickResponseDTO {
    private Integer userId;

    @Builder
    public LiveKickResponseDTO(Integer userId) {
        this.userId = userId;
    }
}
