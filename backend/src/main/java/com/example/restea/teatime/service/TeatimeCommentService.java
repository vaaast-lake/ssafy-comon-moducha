package com.example.restea.teatime.service;

import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_NOT_ACTIVATED;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIMEBOARD_NOT_FOUND;
import static com.example.restea.teatime.enums.TeatimeCommentMessage.TEATIME_COMMENT_NO_CONTENT;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.teatime.dto.TeatimeCommentViewResponse;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeComment;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeCommentRepository;
import com.example.restea.teatime.repository.TeatimeReplyRepository;
import com.example.restea.user.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Service
public class TeatimeCommentService {
    private final UserRepository userRepository;
    private final TeatimeBoardRepository teatimeBoardRepository;
    private final TeatimeCommentRepository teatimeCommentRepository;
    private final TeatimeReplyRepository teatimeReplyRepository;

    public ResponseDTO<List<TeatimeCommentViewResponse>> getTeatimeCommentList(Integer teatimeBoardId, Integer page,
                                                                               Integer perPage) {
        TeatimeBoard teatimeBoard = getActivatedBoard(teatimeBoardId);

        // data
        Page<TeatimeComment> teatimeComments = getTeatimeComments(teatimeBoard, page, perPage);
        List<TeatimeCommentViewResponse> data = createResponseFromTeatimeComments(teatimeComments.getContent());
        Long count = teatimeCommentRepository.countAllByTeatimeBoard(teatimeBoard);

        // pagination info
        PaginationDTO pagination = PaginationDTO.of(count.intValue(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    private @NotNull TeatimeBoard getActivatedBoard(Integer teatimeBoardId) {
        TeatimeBoard teatimeBoard = teatimeBoardRepository.findById(teatimeBoardId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, TEATIMEBOARD_NOT_FOUND.getMessage()));
        if (!teatimeBoard.getActivated()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, TEATIMEBOARD_NOT_ACTIVATED.getMessage());
        }
        return teatimeBoard;
    }

    private @NotNull Page<TeatimeComment> getTeatimeComments(TeatimeBoard teatimeBoard, Integer page, Integer perPage) {

        Page<TeatimeComment> teatimeComments = teatimeCommentRepository.findAllByTeatimeBoard(teatimeBoard,
                PageRequest.of(page - 1, perPage));
        if (teatimeComments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, TEATIME_COMMENT_NO_CONTENT.getMessage());
        }
        return teatimeComments;
    }

    private List<TeatimeCommentViewResponse> createResponseFromTeatimeComments(List<TeatimeComment> teatimeComments) {
        List<TeatimeCommentViewResponse> data = new ArrayList<>();

        teatimeComments.forEach(teatimeComment -> {
            Integer replyCount = teatimeReplyRepository.countByTeatimeComment(teatimeComment).intValue();
            data.add(TeatimeCommentViewResponse.of(teatimeComment, replyCount));
        });
        return data;
    }
}
