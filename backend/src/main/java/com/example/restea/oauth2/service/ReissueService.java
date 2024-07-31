package com.example.restea.oauth2.service;

import static com.example.restea.oauth2.enums.ReissueStatus.REFRESH_EXPIRED;
import static com.example.restea.oauth2.enums.ReissueStatus.REFRESH_INVALID;
import static com.example.restea.oauth2.enums.ReissueStatus.REFRESH_NULL;
import static com.example.restea.oauth2.enums.TokenType.ACCESS;
import static com.example.restea.oauth2.enums.TokenType.BEARER;
import static com.example.restea.oauth2.enums.TokenType.REFRESH;
import static com.example.restea.user.enums.UserMessage.USER_NOT_FOUND;

import com.example.restea.oauth2.jwt.JWTUtil;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReissueService {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    private static final Long MS_TO_S = 1000L;

    public void validateToken(String refreshToken) {
        // 토큰 존재 여부 확인
        if (isTokenNull(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, REFRESH_NULL.getMessage());
        }

        // 토큰 만료 여부 확인
        if (isTokenExpired(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, REFRESH_EXPIRED.getMessage());
        }

        // 토큰 카테고리 확인
        if (isTokenValid(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, REFRESH_INVALID.getMessage());
        }
    }

    // 토큰 존재 확인
    private boolean isTokenNull(String refreshToken) {
        return refreshToken == null;
    }

    // 토큰 만료 확인
    private boolean isTokenExpired(String refreshToken) {
        try {
            jwtUtil.isExpired(refreshToken);
            return false;
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    // 토큰 카테고리 확인
    private boolean isTokenValid(String refreshToken) {
        String category = jwtUtil.getCategory(refreshToken);
        return category.equals(REFRESH.getType()); // RefreshToken 카테고리이면 true
    }

    // 새로운 AccessToken 발급
    public String createNewAccessToken(String refresh) {
        String nickname = jwtUtil.getNickname(refresh);
        Integer userId = jwtUtil.getUserId(refresh);
        String role = jwtUtil.getRole(refresh);

        return BEARER + jwtUtil.createJwt(ACCESS.getType(), userId, nickname, role, ACCESS.getExpiration() * MS_TO_S);
    }

    // RefreshToken이 존재하는지 확인
    public void checkRefresh(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_FOUND.getMessage()));

        if (user.getRefreshToken() == null) { // User의 RefreshToken이 없으면 예외 발생
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, REFRESH_INVALID.getMessage());
        }
    }
}