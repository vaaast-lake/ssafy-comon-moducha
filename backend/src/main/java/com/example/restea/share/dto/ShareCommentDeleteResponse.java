package com.example.restea.share.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ShareCommentDeleteResponse {
    private final Integer shareCommentId;

    @Builder
    public ShareCommentDeleteResponse(Integer shareCommentId) {
        this.shareCommentId = shareCommentId;
    }
}
