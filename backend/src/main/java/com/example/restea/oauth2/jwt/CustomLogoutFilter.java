package com.example.restea.oauth2.jwt;

import static com.example.restea.oauth2.enums.TokenType.REFRESH;

import com.example.restea.oauth2.entity.AuthToken;
import com.example.restea.oauth2.repository.AuthTokenRepository;
import com.example.restea.oauth2.repository.RefreshTokenRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.GenericFilterBean;

@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

    private static final Pattern LOGOUT_PATTERN = Pattern.compile("^/api/v1/logout$");
    private static final String POST_METHOD = "POST";

    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final AuthTokenRepository authTokenRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        doFilterInternal((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        // 로그아웃 경로와 다른 경우
        if (isNotLogoutRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String refreshToken = getRefreshTokenFromCookies(request.getCookies());

        // RefreshToken이 null이거나, 카테고리가 다르거나, 만료된 경우.
        if (refreshToken == null || isInvalidRefreshToken(refreshToken)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        processLogout(response, refreshToken);
    }

    private boolean isNotLogoutRequest(HttpServletRequest request) {
        return !(LOGOUT_PATTERN.matcher(request.getRequestURI()).matches() && POST_METHOD.equals(request.getMethod()));
    }

    private String getRefreshTokenFromCookies(Cookie[] cookies) {
        // 쿠키가 하나도 없을 경우 null을 반환하도록 한다.
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(REFRESH.getType())) {
                return cookie.getValue();
            }
        }
        return null;
    }


    private boolean isInvalidRefreshToken(String refreshToken) {
        try {
            // 만료되었거나, 카테고리가 같지 않다면 Invalid한 토큰
            if (jwtUtil.isExpired(refreshToken) || !REFRESH.getType().equals(jwtUtil.getCategory(refreshToken))) {
                return true;
            }
        } catch (ExpiredJwtException e) {
            // 만료가 되었다면 Exception이 발생한다. 이 경우 Invalid한 토큰
            return true;
        }
        // 만약 DB에 존재하지 않는다면 Invalid한 토큰
        return !refreshTokenRepository.existsByValue(refreshToken);
    }

    private void processLogout(HttpServletResponse response, String refreshToken) {
        User user = findUserByRefreshToken(refreshToken);
        AuthToken authToken = user.getAuthToken();

        clearUserTokens(user); // User에서 토큰 삭제
        deleteTokens(refreshToken, authToken); // 토큰을 DB에서 삭제

        // 쿠키 삭제
        clearRefreshTokenCookie(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void deleteTokens(String refreshToken, AuthToken authToken) {
        authTokenRepository.delete(authToken);
        refreshTokenRepository.deleteByValue(refreshToken);
    }

    private void clearUserTokens(User user) {
        user.deleteAuthToken();
        user.deleteRefreshToken();
        userRepository.save(user); // User 변경
    }

    private User findUserByRefreshToken(String refreshToken) {
        Integer userId = jwtUtil.getUserId(refreshToken);
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException();
        }

        return optionalUser.get();
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH.getType(), null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);
    }
}
