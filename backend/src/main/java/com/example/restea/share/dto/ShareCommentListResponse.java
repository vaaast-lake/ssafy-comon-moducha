package com.example.restea.share.dto;

import com.example.restea.share.entity.ShareComment;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ShareCommentListResponse {
    private final Integer commentId;
    private final Integer boardId;
    private final String content;
    private final LocalDateTime createdDate;
    private final Integer userId;
    private final String nickname;
    private final Integer replyCount;

    public static ShareCommentListResponse of(ShareComment shareComment, Integer replyCount) {
        return ShareCommentListResponse.builder()
                .commentId(shareComment.getId())
                .boardId(shareComment.getShareBoard().getId())
                .content(shareComment.getExposedContent())
                .createdDate(shareComment.getCreatedDate())
                .userId(shareComment.getUser().getId())
                .nickname(shareComment.getExposedNickName())
                .replyCount(replyCount)
                .build();
    }
}