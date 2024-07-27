package com.example.restea.share.service;

import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareCreationResponse;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Objects;
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

  @Transactional
  public ShareCreationResponse createShare(ShareCreationRequest request, Integer userId) {
    checkCreateArgs(request);

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

  // 입력된 값이 유효한지 확인하는 메소드
  private void checkCreateArgs(ShareCreationRequest request) {
    if (Objects.isNull(request) || request.checkNull()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "null arguments");
    }
    boolean emptyTitle = request.getTitle().isBlank();
    boolean overTitleLength = request.getTitle().length() > 50;
    boolean emptyContent = request.getContent().isBlank();
    boolean invalidMaxParticipants = request.getMaxParticipants() < 1;
    boolean invalidEndDate = request.getEndDate().isBefore(LocalDateTime.now());
    if (emptyTitle || overTitleLength || emptyContent || invalidMaxParticipants || invalidEndDate) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid arguments");
    }
  }


}
