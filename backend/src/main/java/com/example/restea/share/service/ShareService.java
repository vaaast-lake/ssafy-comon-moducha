package com.example.restea.share.service;

import static com.example.restea.share.enums.ShareBoardMessage.SHARE_BOARD_NOT_WRITER;
import static com.example.restea.share.util.ShareUtil.getActivatedShareBoard;

import com.example.restea.common.dto.PaginationDTO;
import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareCreationResponse;
import com.example.restea.share.dto.ShareDeleteResponse;
import com.example.restea.share.dto.ShareListResponse;
import com.example.restea.share.dto.ShareUpdateRequest;
import com.example.restea.share.dto.ShareUpdateResponse;
import com.example.restea.share.dto.ShareViewResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.entity.ShareReply;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.share.repository.ShareParticipantRepository;
import com.example.restea.share.util.ShareUtil;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
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
        Page<ShareBoard> shareBoards = getActivatedShareBoards(sort, page, perPage); // 아직 기간이 지나지 않고 활성화된 게시글
        List<ShareListResponse> data = createResponseFormShareBoards(shareBoards.getContent());
        Long count = calculateCount(sort); // latest, urgent 처리방식에 따라 달라질 수 있음

        // pagination info
        PaginationDTO pagination = PaginationDTO.of(count.intValue(), page, perPage);

        return Map.of("data", data, "pagination", pagination);
    }

    @Transactional
    public ShareCreationResponse createShareBoard(ShareCreationRequest request, Integer userId) {

        User activatedUser = ShareUtil.getActivatedUser(userRepository, userId);
        ShareBoard result = shareBoardRepository.save(request.toEntity().addUser(activatedUser));
        return ShareCreationResponse.of(result);
    }

    @Transactional
    public ShareViewResponse getShareBoard(Integer shareBoardId) {

        ShareBoard activatedShareBoard = getActivatedShareBoard(shareBoardRepository, shareBoardId);
        Integer participants = shareParticipantRepository.countByShareBoard(activatedShareBoard).intValue();

        activatedShareBoard.addViewCount();

        return ShareViewResponse.of(activatedShareBoard, participants);
    }

    @Transactional
    public ShareUpdateResponse updateShareBoard(Integer shareBoardId, ShareUpdateRequest request, Integer userId) {

        ShareBoard activatedShareBoard = getActivatedShareBoard(shareBoardRepository, shareBoardId);
        User activatedUser = ShareUtil.getActivatedUser(userRepository, userId);
        checkAuthorized(activatedShareBoard, activatedUser);
        checkLessThanCurrentParticipants(request, activatedShareBoard);

        activatedShareBoard.update(request.getTitle(), request.getContent(), request.getMaxParticipants(),
                request.getEndDate());
        Integer participants = shareParticipantRepository.countByShareBoard(activatedShareBoard).intValue();
        return ShareUpdateResponse.of(activatedShareBoard, participants);
    }

    @Transactional
    public ShareDeleteResponse deactivateShareBoard(Integer shareBoardId, Integer userId) {

        ShareBoard activatedShareBoard = getActivatedShareBoard(shareBoardRepository, shareBoardId);
        User activatedUser = ShareUtil.getActivatedUser(userRepository, userId);
        checkAuthorized(activatedShareBoard, activatedUser);

        activatedShareBoard.deactivate();

        // TODO : shareBoard.deactivate() 안으로 이동
        activatedShareBoard.getShareComments().forEach((comment) -> {
            comment.getShareReplies().forEach(ShareReply::deactivate);
            comment.deactivate();
        });
        shareParticipantRepository.deleteAll(activatedShareBoard.getShareParticipants());

        return ShareDeleteResponse.builder()
                .boardId(shareBoardId)
                .build();
    }

    private Long calculateCount(String sort) {
        return switch (sort) {
            case "latest" -> shareBoardRepository.countByActivated(true);
            case "urgent" -> shareBoardRepository.countByActivatedAndEndDateAfter(true, LocalDateTime.now());
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sort");
        };
    }

    private @NotNull Page<ShareBoard> getActivatedShareBoards(String sort, Integer page, Integer perPage) {

        Page<ShareBoard> shareBoards = switch (sort) {
            case "latest" -> shareBoardRepository.findAllByActivated(true,
                    PageRequest.of(page - 1, perPage, Sort.by("createdDate").descending()));
            case "urgent" -> shareBoardRepository.findAllByActivatedAndEndDateAfter(true, LocalDateTime.now(),
                    PageRequest.of(page - 1, perPage, Sort.by("endDate").ascending()));
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sort");
        };
        if (shareBoards.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoard not found");
        }
        return shareBoards;
    }

    private List<ShareListResponse> createResponseFormShareBoards(List<ShareBoard> shareBoards) {
        List<ShareListResponse> data = new ArrayList<>();
        for (ShareBoard shareBoard : shareBoards) {
            Integer participant = shareParticipantRepository.countByShareBoard(shareBoard).intValue();
            data.add(ShareListResponse.of(shareBoard, participant));
        }
        return data;
    }

    private void checkAuthorized(ShareBoard shareBoard, User activatedUser) {
        if (!Objects.equals(shareBoard.getUser().getId(), activatedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, SHARE_BOARD_NOT_WRITER.getMessage());
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
