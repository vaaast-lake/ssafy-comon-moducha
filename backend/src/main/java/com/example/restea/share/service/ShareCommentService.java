package com.example.restea.share.service;

import static com.example.restea.share.enums.ShareBoardMessage.SHARE_BOARD_USER_NOT_ACTIVATED;
import static com.example.restea.share.enums.ShareCommentMessage.SHARE_COMMENT_NOT_WRITER;
import static com.example.restea.share.enums.ShareCommentMessage.SHARE_COMMENT_NO_CONTENT;
import static com.example.restea.share.util.ShareUtil.getActivatedShareBoard;
import static com.example.restea.share.util.ShareUtil.getActivatedShareComment;
import static com.example.restea.share.util.ShareUtil.getActivatedUser;

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

    private static void checkActivatedBoardWriter(ShareBoard activatedShareBoard) {
        if (activatedShareBoard.getUser().getActivated()) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                SHARE_BOARD_USER_NOT_ACTIVATED.getMessage());
    }

    public ResponseDTO<List<ShareCommentViewResponse>> getShareCommentList(
            Integer shareBoardId, Integer page, Integer perPage) {
        ShareBoard activatedShareBoard = getActivatedShareBoard(shareBoardRepository, shareBoardId);

        // data
        Page<ShareComment> shareComments = getShareComments(activatedShareBoard, page, perPage);
        List<ShareCommentViewResponse> data = createResponseFromShareComments(shareComments.getContent());
        Long count = shareCommentRepository.countAllByShareBoard(activatedShareBoard);

        // pagination info
        PaginationDTO pagination = PaginationDTO.of(count.intValue(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    @Transactional
    public ShareCommentCreationResponse createShareComment(String content, Integer shareBoardId,
                                                           Integer userId) {
        User activatedUser = getActivatedUser(userRepository, userId);
        ShareBoard activatedShareBoard = getActivatedShareBoard(shareBoardRepository, shareBoardId);

        checkActivatedBoardWriter(activatedShareBoard);

        ShareComment shareComment = ShareComment.builder()
                .user(activatedUser)
                .content(content)
                .shareBoard(activatedShareBoard)
                .build();

        shareCommentRepository.save(shareComment);

        return ShareCommentCreationResponse.of(shareComment);
    }

    // ShareBoard와 ShareComment의 관계를 고려하기.
    @Transactional
    public ShareCommentDeleteResponse deactivateShareComment(Integer shareBoardId, Integer shareCommentId,
                                                             Integer userId) {

        ShareBoard activatedShareBoard = getActivatedShareBoard(shareBoardRepository, shareBoardId);
        ShareComment activatedComment = getActivatedShareComment(shareCommentId, activatedShareBoard);

        User activatedUser = getActivatedUser(userRepository, userId);
        checkAuthorized(activatedComment, activatedUser);

        activatedComment.deactivate();

        return ShareCommentDeleteResponse.from(shareCommentId);
    }

    private void checkAuthorized(ShareComment shareComment, User activatedUser) {
        if (!Objects.equals(shareComment.getUser().getId(), activatedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, SHARE_COMMENT_NOT_WRITER.getMessage());
        }
    }

    private List<ShareCommentViewResponse> createResponseFromShareComments(List<ShareComment> shareComments) {
        List<ShareCommentViewResponse> data = new ArrayList<>();

        shareComments.forEach(shareComment -> {
            Integer replyCount = shareReplyRepository.countByShareComment(shareComment).intValue();
            data.add(ShareCommentViewResponse.of(shareComment, replyCount));
        });
        return data;
    }

    private @NotNull Page<ShareComment> getShareComments(ShareBoard activatedShareBoard, Integer page,
                                                         Integer perPage) {

        Page<ShareComment> shareComments = shareCommentRepository.findAllByShareBoard(activatedShareBoard,
                PageRequest.of(page - 1, perPage));
        if (shareComments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_COMMENT_NO_CONTENT.getMessage());
        }
        return shareComments;
    }
}
