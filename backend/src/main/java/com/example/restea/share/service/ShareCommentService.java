package com.example.restea.share.service;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.share.dto.ShareCommentCreationRequest;
import com.example.restea.share.dto.ShareCommentCreationResponse;
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
import java.util.Map;
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

    public Map<String, Object> getShareCommentList(Integer shareBoardId, Integer page, Integer perPage) {
        ShareBoard shareBoard = shareBoardRepository.findById(shareBoardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoard not found"));

        // data
        Page<ShareComment> shareComments = getShareComments(shareBoard, page, perPage);
        List<ShareCommentListResponse> data = createResponseFormShareComments(shareComments.getContent());
        Long count = shareCommentRepository.countAllByShareBoard(shareBoard);

        // pagination info
        PaginationDTO pagination = PaginationDTO.builder()
                .total((count.intValue() - 1) / perPage + 1)
                .page(page)
                .perPage(perPage)
                .build();

        return Map.of("data", data, "pagination", pagination);
    }

    @Transactional
    public ShareCommentCreationResponse createShareComment(ShareCommentCreationRequest request, Integer shareBoardId,
                                                           Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

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

        return ShareCommentCreationResponse.builder()
                .commentId(shareComment.getId())
                .boardId(shareComment.getShareBoard().getId())
                .content(shareComment.getContent())
                .createdDate(shareComment.getCreatedDate())
                .build();
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
        for (ShareComment shareComment : shareComments) {
            data.add(ShareCommentListResponse.builder()
                    .commentId(shareComment.getId())
                    .boardId(shareComment.getShareBoard().getId())
                    .content(shareComment.getExposedContent())
                    .createdDate(shareComment.getCreatedDate())
                    .userId(shareComment.getUser().getId())
                    .nickname(shareComment.getExposedNickName())
                    .replyCount(shareReplyRepository.countByShareComment(shareComment).intValue())
                    .build());
        }
        return data;
    }
}
