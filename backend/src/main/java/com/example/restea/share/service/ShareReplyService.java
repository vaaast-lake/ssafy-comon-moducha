package com.example.restea.share.service;

import static com.example.restea.share.enums.ShareBoardMessage.SHARE_BOARD_USER_NOT_ACTIVATED;
import static com.example.restea.share.enums.ShareCommentMessage.SHARE_COMMENT_NOT_FOUND;
import static com.example.restea.share.enums.ShareReplyMessage.SHARE_REPLY_NOT_ACTIVATED;
import static com.example.restea.share.enums.ShareReplyMessage.SHARE_REPLY_NOT_FOUND;
import static com.example.restea.share.enums.ShareReplyMessage.SHARE_REPLY_NOT_WRITER;
import static com.example.restea.user.enums.UserMessage.USER_NOT_FOUND;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.common.dto.ResponseDTO;
import com.example.restea.share.dto.ShareReplyCreationResponse;
import com.example.restea.share.dto.ShareReplyDeleteResponse;
import com.example.restea.share.dto.ShareReplyViewResponse;
import com.example.restea.share.entity.ShareComment;
import com.example.restea.share.entity.ShareReply;
import com.example.restea.share.repository.ShareCommentRepository;
import com.example.restea.share.repository.ShareReplyRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Service
public class ShareReplyService {

    private final ShareCommentRepository shareCommentRepository;
    private final ShareReplyRepository shareReplyRepository;
    private final UserRepository userRepository;

    public ResponseDTO<List<ShareReplyViewResponse>> getShareReplyList(
            Integer shareCommentId, Integer page, Integer perPage) {

        ShareComment shareComment = shareCommentRepository.findById(shareCommentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, SHARE_COMMENT_NOT_FOUND.getMessage()));

        Page<ShareReply> shareReplies = getShareReplies(shareComment, page, perPage);
        List<ShareReplyViewResponse> data = createResponseFromShareReplies(shareReplies.getContent());
        Long count = shareReplyRepository.countAllByShareComment(shareComment);

        PaginationDTO pagination = PaginationDTO.of(count.intValue(), page, perPage);

        return ResponseDTO.of(data, pagination);
    }

    @Transactional
    public ShareReplyCreationResponse createShareReply(String content, Integer shareCommentId, Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, USER_NOT_FOUND.getMessage()));

        ShareComment shareComment = shareCommentRepository.findById(shareCommentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        SHARE_COMMENT_NOT_FOUND.getMessage()));

        if (!shareComment.getShareBoard().getUser().getActivated()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, SHARE_BOARD_USER_NOT_ACTIVATED.getMessage());
        }

        ShareReply shareReply = ShareReply.builder()
                .content(content)
                .shareComment(shareComment)
                .user(user)
                .build();

        shareReplyRepository.save(shareReply);
        return ShareReplyCreationResponse.of(shareReply, user.getExposedNickname());
    }

    @Transactional
    public ShareReplyDeleteResponse deactivateShareReply(Integer shareReplyId, Integer userId) {

        ShareReply shareReply = getActivatedShareReply(shareReplyId);

        checkAuthorized(shareReply, userId);

        shareReply.deactivate();

        return ShareReplyDeleteResponse.from(shareReply);
    }

    private ShareReply getActivatedShareReply(Integer shareReplyId) {
        ShareReply shareReply = shareReplyRepository.findById(shareReplyId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_REPLY_NOT_FOUND.getMessage()));
        if (!shareReply.getActivated()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_REPLY_NOT_ACTIVATED.getMessage());
        }
        return shareReply;
    }

    private void checkAuthorized(ShareReply shareReply, Integer userId) {
        if (!shareReply.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, SHARE_REPLY_NOT_WRITER.getMessage());
        }
    }

    private @NotNull Page<ShareReply> getShareReplies(ShareComment shareComment, Integer page, Integer perPage) {
        Page<ShareReply> shareReplies = shareReplyRepository
                .findAllByShareComment(shareComment, PageRequest.of(page - 1, perPage));
        if (shareReplies.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SHARE_REPLY_NOT_FOUND.getMessage());
        }
        return shareReplies;
    }

    private List<ShareReplyViewResponse> createResponseFromShareReplies(List<ShareReply> shareReplies) {

        List<ShareReplyViewResponse> data = new ArrayList<>();
        shareReplies.forEach(shareReply -> {
            data.add(ShareReplyViewResponse.of(shareReply));
        });
        return data;
    }
}
