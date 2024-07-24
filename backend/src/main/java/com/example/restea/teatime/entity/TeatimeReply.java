package com.example.restea.teatime.entity;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@Table(name = "teatime_reply")
public class TeatimeReply extends BaseTimeEntity {

    @Id
    @GeneratedValue
    @Column(name = "teatime_reply_id")
    private Integer id;

    @Column(nullable = false, length = 100)
    private String content;

    @Column(nullable = false)
    @ColumnDefault("true")
    private Boolean activated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatime_comment_id", insertable = false, updatable = false)
    private TeatimeComment teatimeComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", insertable = false, updatable = false)
    private User user;
}