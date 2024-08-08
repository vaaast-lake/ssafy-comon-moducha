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

    private static final String SEOUL = "Asia/Seoul";
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addRefreshToken(User user, String value, Long expiredMs) {
        RefreshToken refreshToken = getRefreshToken(value, expiredMs);

        // 연관관계 매핑을 위해 User에 RefreshToken 추가
        if (user.getRefreshToken() != null) { // 원래 RefreshToken이 존재했다면
            revokeExistingRefreshToken(user);
        }

        if (user.getRefreshToken() == null) { // RefreshToken이 없는 상태라면
            user.addRefreshToken(refreshToken);
        }

        // RefreshToken 저장 및 User 저장
        saveRefreshTokenAndUser(user, refreshToken);
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

    private void revokeExistingRefreshToken(User user) {
        refreshTokenRepository.revokeById(user.getRefreshToken().getId());
        user.deleteRefreshToken();
    }

    private void saveRefreshTokenAndUser(User user, RefreshToken refreshToken) {
        refreshTokenRepository.save(refreshToken);
        userRepository.save(user);
    }
}
