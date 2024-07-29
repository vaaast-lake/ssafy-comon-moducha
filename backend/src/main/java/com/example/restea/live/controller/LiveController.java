package com.example.restea.live.controller;

import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.live.dto.LiveIsOpenResponseDTO;
import com.example.restea.live.dto.LiveRoomResponseDTO;
import com.example.restea.live.service.LiveService;
import com.example.restea.oauth2.dto.CustomOAuth2User;
import io.livekit.server.AccessToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/teatimes/{teatimeBoardId}/lives")
@RequiredArgsConstructor
public class LiveController {

    private final LiveService liveService;

    /**
     * 주어진 티타임 게시글 방송 생성 여부 조회
     *
     * @param teatimeBoardId   티타임게시판 ID.
     * @param customOAuth2User 현재 인증된 사용자.
     * @return 방송 개설 여부를 포함하는 ResponseEntity 객체를 반환합니다. 방송 개설 여부 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.
     */
    @GetMapping
    public ResponseEntity<ResponseDTO<LiveIsOpenResponseDTO>> isLiveOpen(
            @PathVariable("teatimeBoardId") int teatimeBoardId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        boolean isOpen = liveService.isLiveOpen(teatimeBoardId, customOAuth2User.getUserId());

        LiveIsOpenResponseDTO result = LiveIsOpenResponseDTO.builder()
                .isOpen(isOpen)
                .build();

        ResponseDTO<LiveIsOpenResponseDTO> response = ResponseDTO.<LiveIsOpenResponseDTO>builder()
                .data(result)
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 주어진 티타임 게시글 방송 생성
     *
     * @param teatimeBoardId   티타임게시판 ID. 티타임게시판ID을 외래키로 가지는 live테이블에 새로운 레코드 생성. liveId는 사용자가 연결하려는 방의 이름
     * @param customOAuth2User 현재 인증된 사용자.
     * @return liveId와 user 정보로 만든 JWT token을 포함하는 ResponseEntity 객체를 반환합니다. token 생성에 실패하면 에러 코드를 담은 ResponseEntity를
     * 반환합니다.
     */
    @PostMapping
    public ResponseEntity<ResponseDTO<LiveRoomResponseDTO>> createLive(
            @PathVariable("teatimeBoardId") int teatimeBoardId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        AccessToken sessionInfo = liveService.createLive(teatimeBoardId, customOAuth2User.getUserId());

        LiveRoomResponseDTO result = LiveRoomResponseDTO.builder()
                .token(sessionInfo.toJwt())
                .build();

        ResponseDTO<LiveRoomResponseDTO> response = ResponseDTO.<LiveRoomResponseDTO>builder()
                .data(result)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 주어진 방 이름과 참가자에 대한 토큰을 생성
     *
     * @param teatimeBoardId   티타임게시판 ID. 티타임게시판ID을 외래키로 가지는 live테이블에 저장된 liveId를 사용. liveId는 사용자가 연결하려는 방의 이름
     * @param customOAuth2User 현재 인증된 사용자. 이 사용자는 티타임 방송에 참가하려는 참가자의 정보로 쓰인다.
     * @return teatimeId와 user 정보로 만든 JWT token을 포함하는 ResponseEntity 객체를 반환합니다. token 생성에 실패하면 에러 메시지를 담은
     * ResponseEntity를 반환합니다.
     */
    @PostMapping("/token")
    public ResponseEntity<ResponseDTO<LiveRoomResponseDTO>> liveJoin(
            @PathVariable("teatimeBoardId") int teatimeBoardId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        AccessToken sessionInfo = liveService.liveJoin(teatimeBoardId, customOAuth2User.getUserId());

        LiveRoomResponseDTO result = LiveRoomResponseDTO.builder()
                .token(sessionInfo.toJwt())
                .build();

        ResponseDTO<LiveRoomResponseDTO> response = ResponseDTO.<LiveRoomResponseDTO>builder()
                .data(result)
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // LiveKit 웹훅 이벤트를 수신 -> LiveKit Server로 부터 받음, 항상 ok를 반환해 줘야함.
    @PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
    public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader,
                                                 @RequestBody String body) {

        liveService.webHook(authHeader, body);
        return ResponseEntity.ok("ok");
    }


}
