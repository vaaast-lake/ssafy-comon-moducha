package com.example.restea.share.controller;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.share.dto.ShareCommentCreationRequest;
import com.example.restea.share.service.ShareCommentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/shares/{share_board_id}/comments")
public class ShareCommentController {
    private final ShareCommentService shareCommentService;

    @GetMapping
    public ResponseEntity<ResponseDTO<?>> getShareCommentList(
            @PathVariable("share_board_id") Integer shareBoardId,
            @NotNull @Positive @RequestParam("perPage") Integer perPage,
            @NotNull @Positive @RequestParam("page") Integer page) {

        Map<String, Object> result = shareCommentService.getShareCommentList(shareBoardId, page, perPage);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDTO.builder()
                        .data(result.get("data"))
                        .pagination((PaginationDTO) result.get("pagination"))
                        .build());
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<?>> createShareBoard(
            @PathVariable("share_board_id") Integer shareBoardId,
            @Valid @RequestBody ShareCommentCreationRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.builder()
                        .data(shareCommentService.createShareComment(request, shareBoardId,
                                customOAuth2User.getUserId()))
                        .build());
    }
}
