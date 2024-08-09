package com.example.restea.teatime.service;

import static com.example.restea.share.enums.ShareBoardMessage.SHARE_BOARD_NOT_FOUND;
import static com.example.restea.teatime.enums.TeatimeBoardMessage.TEATIME_BOARD_USER_NOT_ACTIVATED;
import static com.example.restea.teatime.enums.TeatimeCommentMessage.TEATIME_COMMENT_NOT_FOUND;
import static com.example.restea.teatime.enums.TeatimeCommentMessage.TEATIME_COMMENT_NOT_WRITER;
import static com.example.restea.teatime.enums.TeatimeCommentMessage.TEATIME_COMMENT_NO_CONTENT;
import static com.example.restea.user.enums.UserMessage.USER_NOT_ACTIVATED;
import static com.example.restea.user.enums.UserMessage.USER_NOT_FOUND;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.teatime.dto.TeatimeCommentCreationResponse;
import com.example.restea.teatime.dto.TeatimeCommentDeleteResponse;
import com.example.restea.teatime.dto.TeatimeCommentViewResponse;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeComment;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeCommentRepository;
import com.example.restea.teatime.repository.TeatimeReplyRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

    @Transactional
    public TeatimeCommentCreationResponse createTeatimeComment(String content, Integer teatimeBoardId, Integer userId) {

        User user = validateUser(userId);

        TeatimeBoard teatimeBoard = getActivatedBoard(teatimeBoardId);

        if (!teatimeBoard.getUser().getActivated()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TEATIME_BOARD_USER_NOT_ACTIVATED.getMessage());
        }

        TeatimeComment teatimeComment = TeatimeComment.builder()
                .user(user)
                .content(content)
                .teatimeBoard(teatimeBoard)
                .build();

        teatimeCommentRepository.save(teatimeComment);

        return TeatimeCommentCreationResponse.of(teatimeComment);
    }

    @Transactional
    public TeatimeCommentDeleteResponse deactivateTeatimeComment(Integer teatimeBoardId, Integer teatimeCommentId,
                                                                 Integer userId) {

        User user = validateUser(userId);

        TeatimeBoard teatimeBoard = getActivatedBoard(teatimeBoardId);

        TeatimeComment teatimeComment = teatimeBoard.getTeatimeComments().stream()
                .filter(comment -> Objects.equals(comment.getId(), teatimeCommentId))
                .filter(TeatimeComment::getActivated)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, TEATIME_COMMENT_NOT_FOUND.getMessage()));

        checkWriter(teatimeComment, userId);

        teatimeComment.deactivate();

        return TeatimeCommentDeleteResponse.from(teatimeCommentId);
    }

    private @NotNull TeatimeBoard getActivatedBoard(Integer teatimeBoardId) {
        return teatimeBoardRepository.findByIdAndActivated(teatimeBoardId, true)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, SHARE_BOARD_NOT_FOUND.getMessage()));
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

    private User validateUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_FOUND.getMessage()));

        if (!user.getActivated()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_ACTIVATED.getMessage());
        }

        return user;
    }

    private void checkWriter(TeatimeComment teatimeComment, Integer userId) {
        if (!Objects.equals(teatimeComment.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, TEATIME_COMMENT_NOT_WRITER.getMessage());
        }
    }

}
