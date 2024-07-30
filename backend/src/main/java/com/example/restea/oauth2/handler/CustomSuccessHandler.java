package com.example.restea.oauth2.handler;


import static com.example.restea.oauth2.enums.TokenType.ACCESS;
import static com.example.restea.oauth2.enums.TokenType.BEARER;
import static com.example.restea.oauth2.enums.TokenType.REFRESH;

import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.oauth2.jwt.JWTUtil;
import com.example.restea.oauth2.service.RefreshTokenService;
import com.example.restea.oauth2.util.CookieMethods;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;
    private final CookieMethods cookieMethods;
    private final RefreshTokenService refreshTokenService;

    private static final Long MS_TO_S = 1000L;

    @Value("${app.redirect.url}")
    private String appRedirectUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        String nickname = customUserDetails.getNickname();
        Integer userId = customUserDetails.getUserId();
        String role = extractUserRole(authentication);

        // 토큰 생성
        String accessToken = createAccessToken(userId, nickname, role);
        String refreshToken = createRefreshToken(userId, nickname, role);

        // Refresh 토큰 저장
        saveRefreshToken(userId, refreshToken);
        addRefreshTokenToResponse(response, refreshToken);

        // Redirect
        redirectToTargetWithToken(request, response, accessToken);
    }

    private String extractUserRole(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.iterator().next().getAuthority();
    }

    private String createAccessToken(Integer userId, String nickname, String role) {
        return BEARER + jwtUtil.createJwt(ACCESS.getType(), userId, nickname, role, ACCESS.getExpiration() * MS_TO_S);
    }

    private String createRefreshToken(Integer userId, String nickname, String role) {
        return jwtUtil.createJwt(REFRESH.getType(), userId, nickname, role, REFRESH.getExpiration() * MS_TO_S);
    }

    private void saveRefreshToken(Integer userId, String refreshToken) {
        refreshTokenService.addRefreshToken(userId, refreshToken, REFRESH.getExpiration() * MS_TO_S);
    }

    private void addRefreshTokenToResponse(HttpServletResponse response, String refreshToken) {
        Cookie refreshCookie = cookieMethods.createCookie(REFRESH.getType(), refreshToken);
        response.addCookie(refreshCookie);
    }

    private void redirectToTargetWithToken(HttpServletRequest request, HttpServletResponse response, String accessToken)
            throws IOException {
        response.setStatus(HttpStatus.OK.value());
        String targetUrl = getTargetUrl(accessToken);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    // 액세스 토큰을 queryParam에 추가
    private String getTargetUrl(String accessToken) {
        return UriComponentsBuilder.fromUriString(appRedirectUrl)
                .queryParam("access", accessToken)
                .build()
                .toUriString();
    }
}
