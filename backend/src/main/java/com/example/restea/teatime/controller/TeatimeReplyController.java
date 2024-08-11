package com.example.restea.teatime.controller;

import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.teatime.dto.TeatimeReplyViewResponse;
import com.example.restea.teatime.service.TeatimeReplyService;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teatimes/{teatimeBoardId}/comments/{teatimeCommentId}")
public class TeatimeReplyController {

    private final TeatimeReplyService teatimeReplyService;

    /**
     * 주어진 티타임 게시글 및 댓글의 답글 조회
     *
     * @param teatimeBoardId   티타임 게시글 ID.
     * @param teatimeCommentId 티타임 댓글 ID.
     * @param perPage          페이지 당 항목 수.
     * @param page             페이지 번호.
     * @return 페이지 정보와 답글 리스트를 포함하는 ResponseEntity 객체를 반환합니다. 답글 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.
     */
    @GetMapping("/replies")
    public ResponseEntity<ResponseDTO<?>> getTeatimeReplyList(
            @PathVariable("teatimeBoardId") Integer teatimeBoardId,
            @PathVariable("teatimeCommentId") Integer teatimeCommentId,
            @NotNull @Positive @RequestParam("perPage") Integer perPage,
            @NotNull @Positive @RequestParam("page") Integer page) {

        ResponseDTO<List<TeatimeReplyViewResponse>> result
                = teatimeReplyService.getTeatimeReplyList(teatimeBoardId, teatimeCommentId, page, perPage);

        if (result.getData().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(result);
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(result);
    }
}
