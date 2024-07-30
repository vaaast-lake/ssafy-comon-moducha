package com.example.restea.share.service;

import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareCreationResponse;
import com.example.restea.share.dto.ShareDeleteResponse;
import com.example.restea.share.dto.ShareUpdateRequest;
import com.example.restea.share.dto.ShareUpdateResponse;
import com.example.restea.share.dto.ShareViewResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.share.repository.ShareParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
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
    boolean isLessThanCurrentParticipants = request.getMaxParticipants() < shareParticipantRepository.countByShareBoard(shareBoard);
    if (isLessThanCurrentParticipants) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "현재 신청자보다 적은 인원으로 수정할 수 없습니다.");
    }
  }

}
