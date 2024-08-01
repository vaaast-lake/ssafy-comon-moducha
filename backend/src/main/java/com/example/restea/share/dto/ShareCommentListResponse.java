package com.example.restea.share.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ShareCommentListResponse {
    private final Integer commentId;
    private final Integer boardId;
    private final String content;
    private final LocalDateTime createdDate;
    private final Integer userId;
    private final String nickname;
    private final Integer replyCount;

    @Builder
    public ShareCommentListResponse(
            Integer commentId, Integer boardId, String content, LocalDateTime createdDate,
            Integer userId, String nickname, Integer replyCount) {
        this.commentId = commentId;
        this.boardId = boardId;
        this.content = content;
        this.createdDate = createdDate;
        this.userId = userId;
        this.nickname = nickname;
        this.replyCount = replyCount;
    }
}