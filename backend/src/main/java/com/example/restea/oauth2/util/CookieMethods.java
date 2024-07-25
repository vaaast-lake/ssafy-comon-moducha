package com.example.restea.oauth2.util;

import static com.example.restea.oauth2.enums.TokenType.REFRESH;

import org.springframework.stereotype.Component;

@Component
public class CookieMethods {
    // 쿠키를 만드는 메소드
    public jakarta.servlet.http.Cookie createCookie(String key, String value) {

        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie(key, value);
        cookie.setMaxAge(REFRESH.getExpiration());
//        cookie.setSecure(true); // https 통신을 할 경우 Secure 옵션을 적용 하면 된다.
        cookie.setPath("/"); // 쿠키의 범위 설정 가능
        cookie.setHttpOnly(true); // XSS 공격 방어

        return cookie;
    }
}