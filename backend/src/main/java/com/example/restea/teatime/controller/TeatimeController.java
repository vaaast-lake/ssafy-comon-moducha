package com.example.restea.teatime.controller;

import com.example.restea.common.dto.PaginationAndSortingDto;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.teatime.dto.TeatimeCreationRequest;
import com.example.restea.teatime.dto.TeatimeCreationResponse;
import com.example.restea.teatime.dto.TeatimeListResponse;
import com.example.restea.teatime.service.TeatimeService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teatimes")
public class TeatimeController {
    private final TeatimeService teatimeService;

    /**
     * 티타임 게시글 목록 조회
     *
     * @param dto sort: 정렬 상태, page: 페이지 번호, perpage: 페이지 당 항목 수.
     * @return 페이지 번호에 맞는 게시글 수 만큼 티타임 게시글 목록을 포함하는 ResponseEntity 객체를 반환합니다. 티타임 게시글 목록 조회에 실패하면 에러 코드를 담은
     * ResponseEntity를 반환합니다.
     */
    @GetMapping
    public ResponseEntity<ResponseDTO<?>> getTeatimeBoardList(@Valid @ModelAttribute PaginationAndSortingDto dto) {
        ResponseDTO<List<TeatimeListResponse>> result = teatimeService.getTeatimeBoardList(
                dto.getSort(),
                dto.getPage(),
                dto.getPerPage());

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<?>> createTeatimeBoard(
            @Valid @RequestBody TeatimeCreationRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        TeatimeCreationResponse result = teatimeService.createTeatimeBoard(request, customOAuth2User.getUserId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.from(result));
    }
}
