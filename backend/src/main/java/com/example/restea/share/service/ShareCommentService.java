package com.example.restea.share.service;

import static com.example.restea.user.enums.UserMessage.USER_NOT_FOUND;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.share.dto.ShareCommentCreationRequest;
import com.example.restea.share.dto.ShareCommentCreationResponse;
import com.example.restea.share.dto.ShareCommentDeleteResponse;
import com.example.restea.share.dto.ShareCommentListResponse;
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

    public ResponseDTO<List<ShareCommentListResponse>> getShareCommentList(Integer shareBoardId, Integer page,
                                                                           Integer perPage) {
        ShareBoard shareBoard = shareBoardRepository.findById(shareBoardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoard not found"));

        // data
        Page<ShareComment> shareComments = getShareComments(shareBoard, page, perPage);
        List<ShareCommentListResponse> data = createResponseFormShareComments(shareComments.getContent());
        Long count = shareCommentRepository.countAllByShareBoard(shareBoard);

        // pagination info
        PaginationDTO pagination = PaginationDTO.of(count.intValue(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    @Transactional
    public ShareCommentCreationResponse createShareComment(ShareCommentCreationRequest request, Integer shareBoardId,
                                                           Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_FOUND.getMessage()));

        ShareBoard shareBoard = shareBoardRepository.findByIdAndActivated(shareBoardId, true)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "ShareBoard not found"));

        if (!shareBoard.getUser().getActivated()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ShareBoard User not activated");
        }

        ShareComment shareComment = ShareComment.builder()
                .user(user)
                .content(request.getContent())
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

        return ShareCommentDeleteResponse.of(shareCommentId);
    }

    private @NotNull ShareComment getActivatedComment(Integer shareCommentId) {
        ShareComment shareComment = shareCommentRepository.findById(shareCommentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareComment not found"));
        if (!shareComment.getActivated()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareComment deactivated");
        }
        return shareComment;
    }

    private void checkAuthorized(ShareComment shareComment, Integer userId) {
        if (!Objects.equals(shareComment.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
    }

    private @NotNull Page<ShareComment> getShareComments(ShareBoard shareBoard, Integer page, Integer perPage) {

        Page<ShareComment> shareComments = shareCommentRepository.findAllByShareBoard(shareBoard,
                PageRequest.of(page - 1, perPage));
        if (shareComments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoardComment not found");
        }
        return shareComments;
    }

    private List<ShareCommentListResponse> createResponseFormShareComments(List<ShareComment> shareComments) {
        List<ShareCommentListResponse> data = new ArrayList<>();

        shareComments.forEach(shareComment -> {
            Integer replyCount = shareReplyRepository.countByShareComment(shareComment).intValue();
            data.add(ShareCommentListResponse.of(shareComment, replyCount));
        });
        return data;
    }
}
