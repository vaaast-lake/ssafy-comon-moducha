package com.example.restea.oauth2.service;

import com.example.restea.oauth2.entity.RefreshToken;
import com.example.restea.oauth2.repository.RefreshTokenRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    private static final String SEOUL = "Asia/Seoul";
    private static final String USER_NOT_FOUND = "유저 정보가 없습니다.";

    @Transactional
    public void addRefreshToken(Integer userId, String value, Long expiredMs) {
        RefreshToken refreshToken = getRefreshToken(value, expiredMs);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));

        // 연관관계 매핑을 위해 User에 RefreshToken 추가
        user.addRefreshToken(refreshToken);

        // RefreshToken 저장 및 User 저장
        refreshTokenRepository.save(refreshToken);
        userRepository.save(user);
    }

    private RefreshToken getRefreshToken(String value, Long expiredMs) {
        long now = System.currentTimeMillis();
        Instant nowInstant = Instant.ofEpochMilli(now);

        LocalDateTime nowDateTime = LocalDateTime.ofInstant(nowInstant, ZoneId.of(SEOUL));
        LocalDateTime expiredDateTime = nowDateTime.plus(Duration.ofMillis(expiredMs));

        return RefreshToken.builder()
                .value(value)
                .issuedAt(nowDateTime)
                .expiredAt(expiredDateTime)
                .build();
    }
}
