package com.example.restea.user.entity;


import com.example.restea.auth.entity.RefreshToken;
import com.example.restea.common.entity.BaseTimeEntity;
import com.example.restea.oauth2.entity.AuthToken;
import com.example.restea.record.entity.Record;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.entity.ShareComment;
import com.example.restea.share.entity.ShareParticipant;
import com.example.restea.share.entity.ShareReply;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeComment;
import com.example.restea.teatime.entity.TeatimeParticipant;
import com.example.restea.teatime.entity.TeatimeReply;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@Table(name = "users")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue
    @Column(name = "users_id")
    private Integer id;

    @Column(unique = true, length = 12)
    private String nickname;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    @ColumnDefault("'USER'")
    private ROLE role;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String authId;

    @Column(nullable = false)
    @ColumnDefault("true")
    private Boolean activated;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "refresh_token_id")
    private RefreshToken refreshToken;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "auth_token_id")
    private AuthToken authToken;

    // 기록
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Record> records = new ArrayList<>();


    // 나눔 게시판 관련
    @OneToMany(mappedBy = "user") // 글은 유저 삭제 후에도 보존
    private List<ShareBoard> shareBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<ShareComment> shareComments = new ArrayList<>(); // 댓글은 유저 삭제 후에도 보존

    @OneToMany(mappedBy = "user")
    private List<ShareReply> shareReplies = new ArrayList<>(); // 대댓글은 유저 삭제 후에도 보존

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShareParticipant> shareParticipants = new ArrayList<>();


    // 티타임 게시판 관련
    @OneToMany(mappedBy = "user") // 글은 유저 삭제 후에도 보존
    private List<TeatimeBoard> teatimeBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<TeatimeComment> teatimeComments = new ArrayList<>(); // 댓글은 유저 삭제 후에도 보존

    @OneToMany(mappedBy = "user")
    private List<TeatimeReply> teatimeReplies = new ArrayList<>(); // 대댓글은 유저 삭제 후에도 보존

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeatimeParticipant> teatimeParticipants = new ArrayList<>();
}
