package com.example.restea.share.controller;

import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.service.ShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
  public ResponseEntity<ResponseDTO<?>> createShare(
      @RequestBody ShareCreationRequest request, @AuthenticationPrincipal CustomOAuth2User user) {

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ResponseDTO.builder()
            .data(shareService.createShare(request, user.getUserId()))
            .build());
  }

}
