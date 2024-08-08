package com.example.restea.share.service;

import static com.example.restea.share.enums.ShareBoardMessage.SHARE_BOARD_NOT_FOUND;
import static com.example.restea.share.enums.ShareBoardMessage.SHARE_BOARD_USER_NOT_ACTIVATED;
import static com.example.restea.share.enums.ShareCommentMessage.SHARE_COMMENT_NOT_ACTIVATED;
import static com.example.restea.share.enums.ShareCommentMessage.SHARE_COMMENT_NOT_FOUND;
import static com.example.restea.share.enums.ShareCommentMessage.SHARE_COMMENT_NOT_WRITER;
import static com.example.restea.share.enums.ShareCommentMessage.SHARE_COMMENT_NO_CONTENT;
import static com.example.restea.user.enums.UserMessage.USER_NOT_FOUND;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.share.dto.ShareCommentCreationResponse;
import com.example.restea.share.dto.ShareCommentDeleteResponse;
import com.example.restea.share.dto.ShareCommentViewResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.entity.ShareComment;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.share.repository.ShareCommentRepository;
import com.example.restea.share.repository.ShareReplyRepository;
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
public class ShareCommentService {
    private final ShareBoardRepository shareBoardRepository;
    private final ShareCommentRepository shareCommentRepository;
    private final UserRepository userRepository;
    private final ShareReplyRepository shareReplyRepository;

    public ResponseDTO<List<ShareCommentViewResponse>> getShareCommentList(Integer shareBoardId, Integer page,
                                                                           Integer perPage) {
        ShareBoard shareBoard = shareBoardRepository.findById(shareBoardId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_BOARD_NOT_FOUND.getMessage()));

        // data
        Page<ShareComment> shareComments = getShareComments(shareBoard, page, perPage);
        List<ShareCommentViewResponse> data = createResponseFromShareComments(shareComments.getContent());
        Long count = shareCommentRepository.countAllByShareBoard(shareBoard);

        // pagination info
        PaginationDTO pagination = PaginationDTO.of(count.intValue(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    @Transactional
    public ShareCommentCreationResponse createShareComment(String content, Integer shareBoardId,
                                                           Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_FOUND.getMessage()));

        ShareBoard shareBoard = shareBoardRepository.findByIdAndActivated(shareBoardId, true)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, SHARE_BOARD_NOT_FOUND.getMessage()));

        if (!shareBoard.getUser().getActivated()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, SHARE_BOARD_USER_NOT_ACTIVATED.getMessage());
        }

        ShareComment shareComment = ShareComment.builder()
                .user(user)
                .content(content)
                .shareBoard(shareBoard)
                .build();

        shareCommentRepository.save(shareComment);

        return ShareCommentCreationResponse.of(shareComment);
    }

    @Transactional
    public ShareCommentDeleteResponse deactivateShareComment(Integer shareCommentId, Integer userId) {

        ShareComment shareComment = getActivatedComment(shareCommentId);

        checkAuthorized(shareComment, userId);

        shareComment.deactivate();

        return ShareCommentDeleteResponse.from(shareCommentId);
    }

    private @NotNull ShareComment getActivatedComment(Integer shareCommentId) {
        ShareComment shareComment = shareCommentRepository.findById(shareCommentId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_COMMENT_NOT_FOUND.getMessage()));
        if (!shareComment.getActivated()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_COMMENT_NOT_ACTIVATED.getMessage());
        }
        return shareComment;
    }

    private void checkAuthorized(ShareComment shareComment, Integer userId) {
        if (!Objects.equals(shareComment.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, SHARE_COMMENT_NOT_WRITER.getMessage());
        }
    }

    private @NotNull Page<ShareComment> getShareComments(ShareBoard shareBoard, Integer page, Integer perPage) {

        Page<ShareComment> shareComments = shareCommentRepository.findAllByShareBoard(shareBoard,
                PageRequest.of(page - 1, perPage));
        if (shareComments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_COMMENT_NO_CONTENT.getMessage());
        }
        return shareComments;
    }

    private List<ShareCommentViewResponse> createResponseFromShareComments(List<ShareComment> shareComments) {
        List<ShareCommentViewResponse> data = new ArrayList<>();

        shareComments.forEach(shareComment -> {
            Integer replyCount = shareReplyRepository.countByShareComment(shareComment).intValue();
            data.add(ShareCommentViewResponse.of(shareComment, replyCount));
        });
        return data;
    }
}
