package com.example.restea.share.service;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareCreationResponse;
import com.example.restea.share.dto.ShareDeleteResponse;
import com.example.restea.share.dto.ShareListResponse;
import com.example.restea.share.dto.ShareUpdateRequest;
import com.example.restea.share.dto.ShareUpdateResponse;
import com.example.restea.share.dto.ShareViewResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.share.repository.ShareParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Service
public class ShareService {

    private final ShareBoardRepository shareBoardRepository;
    private final UserRepository userRepository;
    private final ShareParticipantRepository shareParticipantRepository;

    @Transactional
    public Map<String, Object> getShareBoardList(String sort, Integer page, Integer perPage) {

        // data
        Page<ShareBoard> shareBoards = getShareBoards(sort, page, perPage); // 아직 끝나지 않았고 활성화된 게시글
        List<ShareListResponse> data = createResponseFormShareBoards(shareBoards.getContent());
        Long count = shareBoardRepository.countByActivated(true);

        // pagination info
        PaginationDTO pagination = PaginationDTO.builder()
                .total((count.intValue() - 1) / perPage + 1)
                .page(page)
                .perPage(perPage)
                .build();

        return Map.of("data", data, "pagination", pagination);
    }

    @Transactional
    public ShareCreationResponse createShareBoard(ShareCreationRequest request, Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));
        ShareBoard result = shareBoardRepository.save(request.toEntity().addUser(user));

        return ShareCreationResponse.builder() // TODO : refactoring 필요
                .boardId(result.getId())
                .title(result.getTitle())
                .content(result.getContent())
                .endDate(result.getEndDate())
                .maxParticipants(result.getMaxParticipants())
                .build();
    }


    @Transactional
    public ShareViewResponse getShareBoard(Integer shareBoardId) {

        ShareBoard shareBoard = getActivatedBoard(shareBoardId);

        shareBoard.addViewCount();

        return ShareViewResponse.builder() // TODO : refactoring 필요
                .boardId(shareBoard.getId())
                .title(shareBoard.getTitle())
                .content(shareBoard.getContent())
                .createdDate(shareBoard.getCreatedDate())
                .lastUpdated(shareBoard.getLastUpdated())
                .endDate(shareBoard.getEndDate())
                .maxParticipants(shareBoard.getMaxParticipants())
                .participants(shareParticipantRepository.countByShareBoard(shareBoard).intValue())
                .viewCount(shareBoard.getViewCount())
                .nickname(shareBoard.getUser().getExposedNickname())
                .build();
    }

    @Transactional
    public ShareUpdateResponse updateShareBoard(Integer shareBoardId, ShareUpdateRequest request, Integer userId) {

        ShareBoard shareBoard = getActivatedBoard(shareBoardId);

        checkAuthorized(shareBoard, userId);
        checkLessThanCurrentParticipants(request, shareBoard);

        // 업데이트
        shareBoard.update(request.getTitle(), request.getContent(), request.getMaxParticipants(), request.getEndDate());

        return ShareUpdateResponse.builder() // TODO : refactoring 필요
                .boardId(shareBoard.getId())
                .title(shareBoard.getTitle())
                .content(shareBoard.getContent())
                .createdDate(shareBoard.getCreatedDate())
                .lastUpdated(shareBoard.getLastUpdated())
                .endDate(shareBoard.getEndDate())
                .maxParticipants(shareBoard.getMaxParticipants())
                .participants(shareParticipantRepository.countByShareBoard(shareBoard).intValue())
                .viewCount(shareBoard.getViewCount())
                .build();
    }

    @Transactional
    public ShareDeleteResponse deactivateShareBoard(Integer shareBoardId, Integer userId) {

        ShareBoard shareBoard = getActivatedBoard(shareBoardId);

        checkAuthorized(shareBoard, userId);

        shareBoard.deactivate();

        return ShareDeleteResponse.builder()
                .boardId(shareBoardId)
                .build();
    }

    private @NotNull Page<ShareBoard> getShareBoards(String sort, Integer page, Integer perPage) {

        PageRequest pageRequest = switch (sort) {
            case "latest" -> PageRequest.of(page, perPage, Sort.by("createdDate").descending());
            case "urgent" -> PageRequest.of(page, perPage, Sort.by("endDate").ascending());
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sort");
        };

        Page<ShareBoard> shareBoards = shareBoardRepository.findAllActivatedEndFuture(pageRequest);
        if (shareBoards.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoard not found");
        }
        return shareBoards;
    }

    private List<ShareListResponse> createResponseFormShareBoards(List<ShareBoard> shareBoards) {
        List<ShareListResponse> data = new ArrayList<>();
        for (ShareBoard shareBoard : shareBoards) {
            data.add(ShareListResponse.builder()
                    .boardId(shareBoard.getId())
                    .title(shareBoard.getTitle())
                    .createdDate(shareBoard.getCreatedDate())
                    .lastUpdated(shareBoard.getLastUpdated())
                    .endDate(shareBoard.getEndDate())
                    .maxParticipants(shareBoard.getMaxParticipants())
                    .participants(shareParticipantRepository.countByShareBoard(shareBoard).intValue())
                    .nickname(shareBoard.getUser().getExposedNickname())
                    .viewCount(shareBoard.getViewCount())
                    .build());
        }
        return data;
    }

    private @NotNull ShareBoard getActivatedBoard(Integer shareBoardId) {
        ShareBoard shareBoard = shareBoardRepository.findById(shareBoardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoard not found"));
        if (!shareBoard.getActivated()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoard deactivated");
        }
        return shareBoard;
    }

    private void checkAuthorized(ShareBoard shareBoard, Integer userId) {
        if (!Objects.equals(shareBoard.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
    }

    private void checkLessThanCurrentParticipants(ShareUpdateRequest request, ShareBoard shareBoard) {
        boolean isLessThanCurrentParticipants =
                request.getMaxParticipants() < shareParticipantRepository.countByShareBoard(shareBoard);
        if (isLessThanCurrentParticipants) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "현재 신청자보다 적은 인원으로 수정할 수 없습니다.");
        }
    }

}
