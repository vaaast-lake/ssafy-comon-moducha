package com.example.restea.live.controller;

import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.live.dto.LiveIsOpenResponseDTO;
import com.example.restea.live.service.LiveService;
import com.example.restea.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
   * @param teatimeBoardId 티타임게시판 ID.
   * @param user 현재 인증된 사용자.
   * @return 방송 개설 여부를 포함하는 ResponseEntity 객체를 반환합니다. token 생성에 실패하면 에러 메시지를 담은 ResponseEntity를 반환합니다.
   */
  @GetMapping
  public ResponseEntity<ResponseDTO<LiveIsOpenResponseDTO>> isLiveOpen(@PathVariable("teatimeBoardId") int teatimeBoardId, @AuthenticationPrincipal User user) {

    boolean isOpen = liveService.isLiveOpen(teatimeBoardId, user);

    LiveIsOpenResponseDTO result = LiveIsOpenResponseDTO.builder()
        .isOpen(isOpen)
        .build();

    ResponseDTO<LiveIsOpenResponseDTO> response = ResponseDTO.<LiveIsOpenResponseDTO>builder()
        .data(result)
        .build();

    return new ResponseEntity<>(response, HttpStatus.OK);
  }



}
