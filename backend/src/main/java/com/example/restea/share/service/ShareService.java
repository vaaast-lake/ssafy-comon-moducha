package com.example.restea.share.service;

import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareCreationResponse;
import com.example.restea.share.dto.ShareViewResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.share.repository.ShareParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
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
  public ShareCreationResponse createShare(ShareCreationRequest request, Integer userId) {

    Optional<User> user = userRepository.findById(userId);
    if (user.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
    }
    ShareBoard result = shareBoardRepository.save(request.toEntity().addUser(user.get()));

    return ShareCreationResponse.builder()
        .shareBoardId(result.getId())
        .title(result.getTitle())
        .content(result.getContent())
        .endDate(result.getEndDate())
        .maxParticipants(result.getMaxParticipants())
        .build();
  }

  @Transactional
  public ShareViewResponse getShareBoard(Integer shareBoardId) {

    // find ShareBoard
    Optional<ShareBoard> shareBoardOptional = shareBoardRepository.findById(shareBoardId);
    if (shareBoardOptional.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ShareBoard not found");
    }
    ShareBoard shareBoard = shareBoardOptional.get();

    // increase view count
    shareBoard.addViewCount();

    return ShareViewResponse.builder()
        .shareBoardId(shareBoard.getId())
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
}
