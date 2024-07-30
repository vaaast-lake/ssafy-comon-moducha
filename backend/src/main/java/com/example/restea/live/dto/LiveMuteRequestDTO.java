package com.example.restea.live.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class LiveMuteRequestDTO {
    @NotNull(message = "empty endDate.")
    private Integer userId;

    @NotBlank(message = "empty title.")
    private String trackSid;
}
