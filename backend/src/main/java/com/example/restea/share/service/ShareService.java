package com.example.restea.share.service;

import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.user.repository.UserRepository;
import com.example.restea.user.entity.User;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ShareService {

  private final ShareBoardRepository shareBoardRepository;
  private final UserRepository userRepository;

  @Transactional
  public ShareBoard createShare(ShareCreationRequest request, Integer userId) {
    checkCreateArgs(request);

    Optional<User> user = userRepository.findById(userId);
    if (user.isEmpty()) {
      throw new IllegalArgumentException();
    }

    ShareBoard shareBoard = request.toEntity().addUser(user.get());
    return shareBoardRepository.save(request.toEntity());
  }

  // 입력된 값이 유효한지 확인하는 메소드
  private void checkCreateArgs(ShareCreationRequest request) {
    boolean emptyTitle = request.getTitle().isEmpty();
    boolean overTitleLength = request.getTitle().length() > 50;
    boolean emptyContent = request.getContent().isEmpty();
    boolean invalidMaxParticipants = request.getMaxParticipants() < 1;
    boolean invalidEndDate = request.getEndDate().isBefore(LocalDateTime.now());
    if (emptyContent || emptyTitle || invalidMaxParticipants || invalidEndDate || overTitleLength) {
      throw new IllegalArgumentException();
    }
  }

}
