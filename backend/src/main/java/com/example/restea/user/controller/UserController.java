package com.example.restea.user.controller;

import com.example.restea.common.dto.PaginationAndSortingDto;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.share.dto.ShareListResponse;
import com.example.restea.user.service.UserMyPageService;
import com.example.restea.user.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final UserMyPageService userMypageService;

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

    /**
     * 내가 작성한 ShareBoardList를 최신순으로 불러오는 API
     *
     * @param customOAuth2User SecurityContextHolder에 등록된 인증된 유저
     * @param dto              sort, page, perPage query Parameter
     * @return ResponseEntity
     */
    @GetMapping("/mypage/shares")
    public ResponseEntity<ResponseDTO<?>> getShareBoardList(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Valid @ModelAttribute PaginationAndSortingDto dto) {

        ResponseDTO<List<ShareListResponse>> shareBoardList =
                userMypageService.getShareBoardList(customOAuth2User.getUserId(),
                        dto.getPage(),
                        dto.getPerPage());

        return ResponseEntity.status(HttpStatus.OK)
                .body(shareBoardList);
    }
}
