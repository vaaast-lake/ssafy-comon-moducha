package com.example.restea.share.entity;

import com.example.restea.common.entity.BaseTimeEntity;
import com.example.restea.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@Table(name = "share_reply")
public class ShareReply extends BaseTimeEntity {

    @Id
    @GeneratedValue
    @Column(name = "share_reply_id")
    private Integer id;

    @Column(nullable = false, length = 100)
    private String content;

    @Column(nullable = false)
    @ColumnDefault("true")
    private Boolean activated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "share_comment_id", nullable = false)
    private ShareComment shareComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User user;

    @Builder
    public ShareReply(String content, ShareComment shareComment, User user) {
        this.content = content;
        this.shareComment = shareComment;
        this.user = user;
    }

    public String getExposedContent() {
        return activated ? content : "삭제된 댓글입니다.";
    }

    public String getExposedNickname() {
        return activated ? user.getExposedNickname() : "";
    }

    public void deactivate() {
        this.activated = false;
    }
}