package com.example.restea.share.controller;

import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareCreationResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.service.ShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/shares")
public class ShareController {

  private final ShareService shareService;

  @PostMapping
//   TODO : @PreAuthorize 어노테이션을 사용하여 권한을 확인할 것
//   @PreAuthorize("hasRole('USER', 'ADMIN')")

// TODO : @AuthenticationPrincipal 어노테이션을 사용하여 로그인한 사용자 정보를 가져올 것
//  public ResponseEntity<ResponseDTO<?>> createShare(
//      @RequestBody ShareCreationRequest request, @AuthenticationPrincipal CustomOAuth2User user) {
//    ShareBoard result = shareService.createShare(request, user.getUserId());

  public ResponseEntity<ResponseDTO<?>> createShare(
      @RequestBody ShareCreationRequest request, Integer userId) {
    ShareBoard result = shareService.createShare(request, userId);

    // if fail to create share then throw Exception
    // if success to create share then return response
    ShareCreationResponse response = ShareCreationResponse.builder()
        .shareBoardId(result.getId())
        .title(result.getTitle())
        .content(result.getContent())
        .endDate(result.getEndDate())
        .maxParticipants(result.getMaxParticipants())
        .build();

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ResponseDTO.builder()
            .data(response)
            .build());
  }

}
