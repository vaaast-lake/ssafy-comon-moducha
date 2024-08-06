package com.example.restea.share.controller;

import com.example.restea.common.dto.PaginationAndSortingDto;
import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareUpdateRequest;
import com.example.restea.share.service.ShareService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/shares")
public class ShareController {
    private final ShareService shareService;

    @GetMapping
    public ResponseEntity<ResponseDTO<?>> getShareBoardList(
            @Valid @ModelAttribute PaginationAndSortingDto dto) {

        Map<String, Object> result =
                shareService.getShareBoardList(dto.getSort(), dto.getPage(), dto.getPerPage());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDTO.builder()
                        .data(result.get("data"))
                        .pagination((PaginationDTO) result.get("pagination"))
                        .build());
    }

    @PostMapping
//   TODO : @PreAuthorize 어노테이션을 사용하여 권한을 확인할 것
//   @PreAuthorize("hasRole('USER', 'ADMIN')")
    public ResponseEntity<ResponseDTO<?>> createShareBoard(
            @Valid @RequestBody ShareCreationRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.builder()
                        .data(shareService.createShareBoard(request, customOAuth2User.getUserId()))
                        .build());
    }

    @GetMapping("/{shareBoardId}")
    public ResponseEntity<ResponseDTO<?>> getShareBoard(
            @PathVariable("shareBoardId") Integer shareBoardId) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDTO.builder()
                        .data(shareService.getShareBoard(shareBoardId))
                        .build());
    }

    @PatchMapping("/{shareBoardId}")
    public ResponseEntity<ResponseDTO<?>> updateShareBoard(
            @PathVariable("shareBoardId") Integer shareBoardId,
            @Valid @RequestBody ShareUpdateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDTO.builder()
                        .data(shareService.updateShareBoard(shareBoardId, request, customOAuth2User.getUserId()))
                        .build());
    }

    @PatchMapping("/deactivated-shares/{shareBoardId}")
    public ResponseEntity<ResponseDTO<?>> deactivateShareBoard(
            @PathVariable("shareBoardId") Integer shareBoardId,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDTO.builder()
                        .data(shareService.deactivateShareBoard(shareBoardId, customOAuth2User.getUserId()))
                        .build());
    }

    // TODO: 나눔 게시판 목록 조회

}
