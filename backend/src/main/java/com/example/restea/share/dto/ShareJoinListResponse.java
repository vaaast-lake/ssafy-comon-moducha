package com.example.restea.share.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ShareJoinListResponse {
    private Integer participantId;
    private LocalDateTime createdDate;
    private String name;
    private String phone;
    private String address;
    private Integer userId;
    private Integer boardId;
    private String nickname;

    public static ShareJoinListResponse of(Integer participantId, LocalDateTime createdDate, String name, String phone,
                                           String address, Integer userId, Integer boardId, String nickname) {
        return ShareJoinListResponse.builder()
                .participantId(participantId)
                .createdDate(createdDate)
                .name(name)
                .phone(phone)
                .address(address)
                .userId(userId)
                .boardId(boardId)
                .nickname(nickname)
                .build();
    }

}