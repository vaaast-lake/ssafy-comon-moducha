package com.example.restea.teatime.service;

import static com.example.restea.teatime.enums.TeatimeCommentMessage.TEATIME_COMMENT_NOT_FOUND;
import static com.example.restea.teatime.util.TeatimeUtil.getActivatedTeatimeBoard;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.teatime.dto.TeatimeReplyViewResponse;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeComment;
import com.example.restea.teatime.entity.TeatimeReply;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeReplyRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Service
public class TeatimeReplyService {

    private final TeatimeReplyRepository teatimeReplyRepository;
    private final TeatimeBoardRepository teatimeBoardRepository;

    public ResponseDTO<List<TeatimeReplyViewResponse>> getTeatimeReplyList(
            Integer teatimeBoardId, Integer teatimeCommentId, Integer page, Integer perPage) {

        TeatimeBoard activatedTeatimeBoard = getActivatedTeatimeBoard(teatimeBoardRepository, teatimeBoardId);
        TeatimeComment teatimeComment = getTeatimeComment(teatimeCommentId, activatedTeatimeBoard);

        Page<TeatimeReply> teatimeReplies = getTeatimeReplies(teatimeComment, page, perPage);
        List<TeatimeReplyViewResponse> data = createResponseFromTeatimeReplies(teatimeReplies.getContent());

        PaginationDTO pagination = PaginationDTO.of(teatimeReplies.getTotalPages(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    public TeatimeComment getTeatimeComment(Integer teatimeCommentId, TeatimeBoard activatedTeatimeBoard) {
        return activatedTeatimeBoard.getTeatimeComments().stream()
                .filter(comment -> Objects.equals(comment.getId(), teatimeCommentId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, TEATIME_COMMENT_NOT_FOUND.getMessage()));
    }

    private Page<TeatimeReply> getTeatimeReplies(TeatimeComment teatimeComment, Integer page, Integer perPage) {
        return teatimeReplyRepository.findAllByTeatimeComment(teatimeComment, PageRequest.of(page - 1, perPage));
    }

    private List<TeatimeReplyViewResponse> createResponseFromTeatimeReplies(List<TeatimeReply> teatimeReplies) {
        List<TeatimeReplyViewResponse> data = new ArrayList<>();
        for (TeatimeReply teatimeReply : teatimeReplies) {
            data.add(TeatimeReplyViewResponse.of(teatimeReply));
        }
        return data;
    }
}
