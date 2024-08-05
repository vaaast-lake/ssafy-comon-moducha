package com.example.restea.user.controller;

import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    /**
     * 유저를 비활성화하는 메소드. 회원이 탈퇴버튼을 누를 경우 작동
     *
     * @param customOAuth2User SecurityContextHolder에 등록된 인증된 유저
     * @return 성공 시 204 No Content
     */
    @PatchMapping("/withdraw")
    public ResponseEntity<Void> withdraw(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        userService.withdrawUser(customOAuth2User.getUserId());

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
