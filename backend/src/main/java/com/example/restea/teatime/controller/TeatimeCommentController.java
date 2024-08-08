package com.example.restea.teatime.controller;

import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.teatime.dto.TeatimeCommentViewResponse;
import com.example.restea.teatime.service.TeatimeCommentService;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teatimes/{teatimeBoardId}")
public class TeatimeCommentController {
    private final TeatimeCommentService teatimeCommentService;

    /**
     * 주어진 나눔 게시글 댓글 조회
     *
     * @param teatimeBoardId 티타임 게시글 ID.
     * @param perPage        페이지 당 항목 수.
     * @param page           페이지 번호.
     * @return 페이지 정보와 댓글 리스트를 포함하는 ResponseEntity 객체를 반환합니다. 댓글 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.
     */
    @GetMapping("/comments")
    public ResponseEntity<ResponseDTO<?>> getTeatimeCommentList(
            @PathVariable("teatimeBoardId") Integer teatimeBoardId,
            @NotNull @Positive @RequestParam("perPage") Integer perPage,
            @NotNull @Positive @RequestParam("page") Integer page) {

        ResponseDTO<List<TeatimeCommentViewResponse>> result = teatimeCommentService.getTeatimeCommentList(
                teatimeBoardId, page,
                perPage);

        return ResponseEntity.status(HttpStatus.OK)
                .body(result);
    }
}
