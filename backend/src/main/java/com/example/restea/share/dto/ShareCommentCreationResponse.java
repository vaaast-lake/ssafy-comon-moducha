package com.example.restea.share.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ShareCommentCreationResponse {
    private final Integer commentId;
    private final Integer boardId;
    private final String content;
    private final LocalDateTime createdDate;

    @Builder
    public ShareCommentCreationResponse(Integer commentId, Integer boardId, String content,
                                        LocalDateTime createdDate) {
        this.commentId = commentId;
        this.boardId = boardId;
        this.content = content;
        this.createdDate = createdDate;
    }

}
