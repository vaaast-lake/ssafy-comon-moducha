package com.example.restea.share.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ShareJoinResponse {
    private Integer participantId;
    private LocalDateTime createdDate;
    private String name;
    private String phone;
    private String address;
    private Integer userId;
    private Integer boardId;

    public static ShareJoinResponse of(Integer participantId, LocalDateTime createdDate, String name, String phone,
                                       String address, Integer userId, Integer boardId) {
        return ShareJoinResponse.builder()
                .participantId(participantId)
                .createdDate(createdDate)
                .name(name)
                .phone(phone)
                .address(address)
                .userId(userId)
                .boardId(boardId)
                .build();
    }
}