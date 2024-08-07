package com.example.restea.share.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ShareCommentDeleteResponse {
    private final Integer shareCommentId;

    public static ShareCommentDeleteResponse of(Integer shareCommentId) {
        return ShareCommentDeleteResponse.builder()
                .shareCommentId(shareCommentId)
                .build();
    }
}
